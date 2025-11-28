'use client';

import { LogoWithText } from '@/shared/components/ui/logo';
import dynamic from 'next/dynamic';

const ThemeDropdown = dynamic(
  () => import('@/shared/components/system/theme-dropdown'),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function SidebarHeader() {
  return (
    <div className="pt-3 pb-2 w-full flex items-center">
      <div className="flex-1">
        <LogoWithText goHome={true} className="pl-4 h-8" size="sm" />
      </div>
      <div className="pr-2">
        <ThemeDropdown />
      </div>
    </div>
  );
}
