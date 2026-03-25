'use client';

import { UserProfile } from '@repo/ui/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { useTheme } from '@repo/ui/hooks/use-theme';

import { useMe } from '@/lib/hooks/use-me';
import { useSignOutMutation } from '@/lib/hooks/use-sign-out-mutation';

interface UserDropdownMenuProps {
  children: React.ReactNode;
}

export function UserDropdownMenu({ children }: UserDropdownMenuProps) {
  const { user } = useMe();
  const { mutateAsync } = useSignOutMutation();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-42 bg-card">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div className="flex items-center gap-x-2">
              <UserProfile profileUrl="" username={user?.username || ''} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {user?.displayName}
                </span>
                <span className="text-muted-foreground text-xs">
                  {user?.username}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-stone-400 dark:text-stone-600">
            테마
          </DropdownMenuLabel>
          <ThemeDropdownMenuItem themeType="dark">다크</ThemeDropdownMenuItem>
          <ThemeDropdownMenuItem themeType="light">
            라이트
          </ThemeDropdownMenuItem>
          <ThemeDropdownMenuItem themeType="system">
            시스템
          </ThemeDropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-muted-foreground"
            onClick={() => mutateAsync()}
          >
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ThemeDropdownMenuProps {
  children: React.ReactNode;
  themeType: 'system' | 'light' | 'dark';
}

function ThemeDropdownMenuItem({
  children,
  themeType,
}: ThemeDropdownMenuProps) {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuItem onClick={() => setTheme(themeType)} asChild>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-sm">{children}</span>
        <div className="size-4 flex items-center justify-center">
          {themeType === theme && (
            <div className="size-1.5 bg-stone-600 dark:bg-stone-400 rounded-full" />
          )}
        </div>
      </div>
    </DropdownMenuItem>
  );
}
