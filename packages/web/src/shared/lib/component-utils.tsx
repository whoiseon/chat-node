import { cn } from './utils';

/**
 * 텍스트에서 특정 키워드 하이라잉
 * @param text - 전체 텍스트
 * @param keyword - 하이라이팅할 키워드
 * @returns React 요소
 */
export function highlightText({
  text,
  keyword,
  className,
}: {
  text: string;
  keyword: string;
  className?: string;
}): React.ReactNode {
  // 하이라이팅 키워드가 없으면 텍스트 반환
  if (!keyword.trim()) return text;

  const regex = new RegExp(
    `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  );
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <mark
          key={index}
          className={cn(
            'bg-brand text-background px-0.5 rounded-[2px]',
            className
          )}
        >
          {part}
        </mark>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
