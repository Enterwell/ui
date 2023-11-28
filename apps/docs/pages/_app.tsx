import { theme } from '../components/theme';
import { ThemeProvider } from '@mui/material';
import { inter } from '../src/fonts';
import '../styles/global.css';
import { AppProps } from 'next/app';
import { useMutationObserver } from '@enterwell/react-hooks';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [resolvedTheme, setResolvedTheme] = useState(
    typeof window !== 'undefined' ? document.querySelector('html')?.style.colorScheme === 'dark' ? 'dark' : 'light' : 'light'
  );

  if (typeof window !== 'undefined') {
    useMutationObserver(
      document.querySelector('html'),
      () => {
        document.querySelector('html')?.style.colorScheme === 'dark' ? setResolvedTheme('dark') : setResolvedTheme('light');
      }, {
      attributes: true
    });
  }

  return (
    <main className={`${inter.variable} font-sans`}>
      <ThemeProvider theme={theme(resolvedTheme)}>
        <Component {...pageProps}></Component>
      </ThemeProvider>
    </main>
  );
}