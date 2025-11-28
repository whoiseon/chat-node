'use client';

import { useTheme } from 'next-themes';
import { useCallback, useMemo } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { Icons } from '@/shared/components/ui/icon';

export default function ThemeDropdown() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = useCallback(
    (theme: string) => {
      setTheme(theme);
    },
    [setTheme]
  );

  const renderedThemeIcon = useMemo(() => {
    switch (theme) {
      case 'dark':
        return <Icons.MoonForTheme />;
      case 'light':
        return <Icons.SunForTheme />;
      default:
        return <Icons.SystemForTheme />;
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-stone-200 dark:hover:bg-stone-750 size-8"
        >
          {renderedThemeIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-50">
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
          <div className="flex items-center justify-between w-full">
            <span>밝은 테마</span>
            {theme === 'light' && <Icons.Check className="size-4" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
          <div className="flex items-center justify-between w-full">
            <span>어두운 테마</span>
            {theme === 'dark' && <Icons.Check className="size-4" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
