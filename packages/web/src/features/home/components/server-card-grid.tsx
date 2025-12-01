'use client';

import ServerCard from './server-card';

export default function ServerCardGrid() {
  return (
    <ul className="grid grid-cols-5 max-[1919px]:grid-cols-4 m-0 p-0 gap-8">
      <ServerCard />
      <ServerCard />
      <ServerCard />
      <ServerCard />
      <ServerCard />
    </ul>
  );
}
