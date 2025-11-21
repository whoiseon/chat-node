'use client';

import { createContext, useContext, useState } from 'react';

type SidebarScrollContextType = {
  isBottom: boolean;
  setIsBottom: (isBottom: boolean) => void;
  isTop: boolean;
  setIsTop: (isTop: boolean) => void;
};

export const SidebarScrollContext = createContext<SidebarScrollContextType>({
  isBottom: false,
  setIsBottom: () => {},
  isTop: false,
  setIsTop: () => {},
});

export const SidebarScrollProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isBottom, setIsBottom] = useState(false);
  const [isTop, setIsTop] = useState(true);

  return (
    <SidebarScrollContext.Provider
      value={{ isBottom, setIsBottom, isTop, setIsTop }}
    >
      {children}
    </SidebarScrollContext.Provider>
  );
};

export const useSidebarScroll = () => {
  const context = useContext(SidebarScrollContext);

  if (!context) {
    throw new Error(
      'useSidebarScroll must be used within a SidebarScrollProvider'
    );
  }

  return context;
};
