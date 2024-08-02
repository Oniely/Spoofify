'use client';

import { ReactNode } from 'react';
import { DownloaderProvider } from './Download';

const Providers = ({ children }: { children: ReactNode }) => {
  return <DownloaderProvider>{children}</DownloaderProvider>;
};

export default Providers;
