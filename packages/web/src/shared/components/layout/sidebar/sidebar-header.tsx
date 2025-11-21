'use client';

import { LogoWithText } from '@/shared/components/ui/logo';

export default function SidebarHeader() {
  return (
    <div className="pt-3 pb-2 w-full">
      <LogoWithText goHome={true} className="px-4" size="sm" />
    </div>
  );
}
