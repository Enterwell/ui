'use client';

import dynamic from 'next/dynamic';

export const ThemeWrapper = dynamic(() => import('../components/internal/ThemeWrapper').then((mod) => mod.ThemeWrapper), { ssr: false });
