'use client';

import { createContext, useContext, useState } from 'react';

type ChannelContextState = {
  isSearchMode: boolean;
  searchValue: string;
  setIsSearchMode: (value: boolean) => void;
  onSearchChange: (value: string) => void;
  onExitSearch: () => void;
};

export const ChannelSearchContext = createContext<ChannelContextState>({
  isSearchMode: false,
  searchValue: '',
  setIsSearchMode: () => {},
  onSearchChange: () => {},
  onExitSearch: () => {},
});

export function ChannelSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <ChannelSearchContext.Provider
      value={{
        isSearchMode,
        setIsSearchMode,
        searchValue,
        onSearchChange: setSearchValue,
        onExitSearch: () => {
          setIsSearchMode(false);
          setSearchValue('');
        },
      }}
    >
      {children}
    </ChannelSearchContext.Provider>
  );
}

export function useChannelSearch() {
  const context = useContext(ChannelSearchContext);
  if (!context) {
    throw new Error(
      'useChannelSearch must be used within a ChannelSearchProvider',
    );
  }
  return context;
}
