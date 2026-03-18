import { Button } from '@repo/ui/components/ui/button';
import { LogoText } from '@repo/ui/components/ui/logo';
import { PropsWithChildren } from 'react';

import { TopBar } from '@/components/system/top-bar';

export default function SessionLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col h-full w-full">
      <TopBar customBackButton={<LogoText />} isCard={false} hasBackButton />
      <div className="flex flex-col flex-1 min-w-100 md:mx-auto px-4">
        {children}
      </div>
      <div className="flex items-center justify-center min-h-20">
        <Button variant="link">이용약관</Button>
        <Button variant="link">개인정보처리방침</Button>
      </div>
    </div>
  );
}
