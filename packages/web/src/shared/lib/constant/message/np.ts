export const npMessage = {
  given: (amount: number) => {
    const formattedAmount = amount?.toLocaleString() ?? '0';
    return `${formattedAmount} NP를 지급받았습니다.`;
  },
  dailyLoginBonusDescription: '일일 로그인 보너스',
} as const;
