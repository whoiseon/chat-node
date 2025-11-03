'use client';

import Logo from '@/components/ui/logo';

export default function SidebarHeader() {
  return (
    <div className="pt-3 pb-2 w-full">
      <div className="flex items-center gap-x-2 px-4">
        <Logo size="sm" />
        <div className="flex flex-col">
          <h1 className="text-base tracking-tight font-semibold">ChatNode</h1>
        </div>
      </div>
    </div>
  );
}
