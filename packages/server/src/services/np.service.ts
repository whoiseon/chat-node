import { prisma } from '@/database';
import { BusinessError } from '@/lib/middlewares/error';
import { DailyLoginBonus } from '@/types';
import { NpTransactionType, Prisma, SystemSettingKey } from 'generated/prisma';

export class NpService {
  /**
   * 일일 로그인 보너스 지급
   */
  async checkAndGiveDailyLoginBonus(userId: string): Promise<DailyLoginBonus> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return {
        isGiven: false,
        amount: 0,
      };
    }

    const now = new Date();
    let shouldGiveBonus = false;

    // 첫 로그인이거나 마지막 로그인이 없으면 보너스 지급
    if (!user.lastLoginAt) {
      shouldGiveBonus = true;
    } else {
      // 마지막 로그인 날짜(day)가 어제인지 확인
      const lastLoginDate = new Date(user.lastLoginAt);
      lastLoginDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (lastLoginDate < today) {
        shouldGiveBonus = true;
      }
    }

    if (shouldGiveBonus) {
      const bonusAmount = await this.calculateDailyLoginBonusAmount();

      if (!bonusAmount.enabled) {
        return {
          isGiven: false,
          amount: 0,
        };
      }

      await this.chargeSystemToUser(user.id, bonusAmount.amount, {
        description: '일일 로그인 보너스',
      });

      return {
        isGiven: true,
        amount: bonusAmount.amount,
      };
    }

    return {
      isGiven: false,
      amount: 0,
    };
  }

  /**
   * 회원가입 시 NP 지급
   */
  async signUpNpBonus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
      },
    });

    if (!user) {
      return false;
    }

    const signupBonusAmount = await prisma.systemSetting.findUnique({
      where: { key: SystemSettingKey.SIGNUP_BONUS_AMOUNT },
      select: {
        settingValue: true,
        enabled: true,
      },
    });

    if (!signupBonusAmount?.enabled) {
      return false;
    }

    if (!signupBonusAmount?.settingValue) {
      return false;
    }

    await this.chargeSystemToUser(user.id, signupBonusAmount.settingValue, {
      description: '회원가입 시 지급 보너스',
    });

    return true;
  }

  /**
   * 사용자에게 NP 지급
   * 시스템 -> 사용자
   */
  async chargeSystemToUser(
    userId: string,
    amount: number,
    chargeOptions: ChargeOptions = {}
  ) {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new BusinessError('존재하지 않는 사용자입니다');
      }

      const nextBalance = user.np + amount;

      const transactionData: Prisma.NpTransactionCreateInput = {
        User: {
          connect: {
            id: userId,
          },
        },
        type: NpTransactionType.GIFT,
        amount,
        balanceBefore: user.np,
        balanceAfter: nextBalance,
      };

      if (chargeOptions.description) {
        transactionData.description = chargeOptions.description;
      }

      if (chargeOptions.metadata) {
        transactionData.metadata = chargeOptions.metadata;
      }

      await tx.npTransaction.create({ data: transactionData });

      await tx.user.update({
        where: { id: userId },
        data: { np: nextBalance },
      });
    });
  }

  /**
   * 일일 로그인 보너스 랜덤 지급 금액 계산
   */
  async calculateDailyLoginBonusAmount() {
    const minAmount = await prisma.systemSetting.findUnique({
      where: { key: SystemSettingKey.DAILY_LOGIN_BONUS_MIN_AMOUNT },
      select: {
        settingValue: true,
        enabled: true,
      },
    });

    const maxAmount = await prisma.systemSetting.findUnique({
      where: { key: SystemSettingKey.DAILY_LOGIN_BONUS_MAX_AMOUNT },
      select: {
        settingValue: true,
        enabled: true,
      },
    });

    if (!minAmount?.enabled || !maxAmount?.enabled) {
      return {
        enabled: false,
        amount: 0,
      };
    }

    if (!minAmount?.settingValue || !maxAmount?.settingValue) {
      return {
        enabled: false,
        amount: 0,
      };
    }

    const range = maxAmount.settingValue - minAmount.settingValue;
    const exponent = 2;
    const random = Math.pow(Math.random(), exponent);

    const bonusAmount = Math.floor(minAmount.settingValue + random * range);

    if (bonusAmount <= 0) {
      return {
        enabled: true,
        amount: 10,
      };
    }

    return {
      enabled: true,
      amount: bonusAmount,
    };
  }
}

export interface ChargeOptions {
  description?: string;
  metadata?: Record<string, any>;
}
