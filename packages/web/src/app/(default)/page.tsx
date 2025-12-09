import ServerCardGrid from '@/features/home/components/server-card-grid';
import ServerFilterBlock from '@/features/home/components/server-filter-block';

import ResponsiveLayout from '@/shared/components/layout/responsive-layout';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

export default function Home() {
  return (
    <ScrollArea className="w-full h-full min-h-svh" hasScrollX>
      <ResponsiveLayout>
        <div className="flex flex-col mx-auto my-0 px-6">
          <div className="pt-4">
            <div className="flex items-center justify-center mt-16">
              <span className="text-3xl font-bold text-foreground">
                대화를 시작해보세요.
              </span>
            </div>
          </div>
          <div className="w-full mt-8">
            <ServerFilterBlock />
            <div className="w-full mt-6 mb-4">
              <main className="w-full">
                <ServerCardGrid />
              </main>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    </ScrollArea>
  );
}
