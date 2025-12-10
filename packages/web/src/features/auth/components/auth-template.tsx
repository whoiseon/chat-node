'use client';

import { LogoWithText } from '@/shared/components/ui/logo';

export function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col items-start gap-y-4">
        <LogoWithText goHome={true} className="ml-2" size="sm" />
        {children}
      </div>
    </div>
  );
}
