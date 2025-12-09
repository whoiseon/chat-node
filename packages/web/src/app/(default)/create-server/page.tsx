import CreateServerForm from '@/features/create-server/components/create-server-form';

import ResponsiveLayout from '@/shared/components/layout/responsive-layout';
import SettingLayout from '@/shared/components/layout/setting-layout';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

export default function Page() {
  return (
    <ScrollArea className="w-full h-full min-h-svh" hasScrollX>
      <ResponsiveLayout>
        <div className="flex flex-col mx-auto my-0">
          <div className="pt-4">
            <div className="flex items-center justify-center mt-16">
              <span className="text-3xl font-bold text-foreground">
                새로운 서버를 개설해보세요.
              </span>
            </div>
          </div>
          <main className="w-full">
            <SettingLayout>
              <CreateServerForm />
            </SettingLayout>
          </main>
        </div>
      </ResponsiveLayout>
    </ScrollArea>
  );
}
