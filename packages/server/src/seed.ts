import 'dotenv/config';

import bcrypt from 'bcrypt';

import { SystemSettingKey } from 'generated/prisma';
import { prisma } from '@/database';

async function main() {
  // 시스템 설정 초기화 (회원가입 보너스 1000 NP)
  await prisma.systemSetting.upsert({
    where: { key: SystemSettingKey.SIGNUP_BONUS_AMOUNT },
    update: {},
    create: {
      key: SystemSettingKey.SIGNUP_BONUS_AMOUNT,
      settingValue: 1000,
    },
  });

  console.log(
    '[Prisma.seed] ✅ 시스템 설정: 회원가입 보너스 설정 완료 (1000 NP)'
  );

  // 시스템 설정 초기화 (일일 로그인 보너스 최소 금액 10 NP)
  await prisma.systemSetting.upsert({
    where: { key: SystemSettingKey.DAILY_LOGIN_BONUS_MIN_AMOUNT },
    update: {},
    create: {
      key: SystemSettingKey.DAILY_LOGIN_BONUS_MIN_AMOUNT,
      settingValue: 10,
    },
  });

  console.log(
    '[Prisma.seed] ✅ 시스템 설정: 일일 로그인 보너스 최소 금액 설정 완료 (10 NP)'
  );

  // 시스템 설정 초기화 (일일 로그인 보너스 최대 금액 200 NP)
  await prisma.systemSetting.upsert({
    where: { key: SystemSettingKey.DAILY_LOGIN_BONUS_MAX_AMOUNT },
    update: {},
    create: {
      key: SystemSettingKey.DAILY_LOGIN_BONUS_MAX_AMOUNT,
      settingValue: 200,
    },
  });

  console.log(
    '[Prisma.seed] ✅ 시스템 설정: 일일 로그인 보너스 최대 금액 설정 완료 (200 NP)'
  );

  // 기본 노드콘 생성
  const defaultNodecons = [
    {
      id: 'cmiidt8n600073b6skzle4v6w',
      name: '해골',
      description: '해골 형태의 노드콘',
      imageUrl:
        'https://paopjanaxzvogcrxpdmq.supabase.co/storage/v1/object/public/nodecon/cmiidt8n600073b6skzle4v6w.png',
      np: 0,
      tags: ['공포', '무료', '사람'],
      enabled: true,
      isOnlyAdmin: false,
    },
    {
      id: 'cmiidkmgt00053b6s1a51jd2q',
      name: '관리자',
      description: '관리자 전용 노드콘',
      imageUrl:
        'https://paopjanaxzvogcrxpdmq.supabase.co/storage/v1/object/public/nodecon/cmiidkmgt00053b6s1a51jd2q.png',
      np: 9999999,
      enabled: false,
      isOnlyAdmin: true,
    },
  ];

  for (const nodecon of defaultNodecons) {
    await prisma.nodeCon.upsert({
      where: { id: nodecon.id },
      update: {},
      create: {
        id: nodecon.id,
        name: nodecon.name,
        description: nodecon.description,
        imageUrl: nodecon.imageUrl,
        np: nodecon.np,
        enabled: nodecon.enabled,
        isOnlyAdmin: nodecon.isOnlyAdmin,
        tags: {
          create:
            nodecon.tags?.map((tag) => ({
              Tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag },
                },
              },
            })) ?? [],
        },
      },
    });
  }

  console.log('[Prisma.seed] ✅ 기본 노드콘 생성 완료');

  const adminUsername = process.env.DEFAULT_ADMIN_USERNAME;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.log(
      '[Prisma.seed] ❌ ADMIN_USERNAME and ADMIN_PASSWORD are required'
    );
    return;
  }

  // 기존 어드민 계정 확인
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
    include: { AdminUser: true },
  });

  if (existingAdmin?.AdminUser) {
    console.log('[Prisma.seed] ✅ 어드민 계정이 이미 존재합니다');
  } else {
    let adminUser;

    if (existingAdmin) {
      adminUser = existingAdmin;
      console.log('[Prisma.seed] ✅ 어드민 계정 존재, 업데이트 준비');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = await prisma.user.create({
        data: {
          username: adminUsername,
          passwordHash: hashedPassword,
        },
      });
      console.log('[Prisma.seed] ✅ 어드민 계정 생성 완료');
    }

    // AdminUser 생성
    await prisma.adminUser.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
      },
    });

    await prisma.userNodeCon.upsert({
      where: {
        userId_nodeConId: {
          userId: adminUser.id,
          nodeConId: 'cmiidkmgt00053b6s1a51jd2q',
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        nodeConId: 'cmiidkmgt00053b6s1a51jd2q',
      },
    });

    await prisma.user.update({
      where: { id: adminUser.id },
      data: { mainNodeConId: 'cmiidkmgt00053b6s1a51jd2q' },
    });

    console.log('[Prisma.seed] ✅ 어드민 노드콘 설정 완료');

    console.log('[Prisma.seed] ✅ 어드민 계정 설정 완료');
    console.log(`✅ 어드민 계정: ${adminUsername}`);
    console.log(`✅ 어드민 비밀번호: ${adminPassword}`);
  }
}

main()
  .catch((e) => {
    console.error('[Prisma.seed] ❌ 초기화 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
