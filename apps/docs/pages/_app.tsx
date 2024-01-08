import dynamic from 'next/dynamic';
import { inter } from '../src/fonts';
import '../styles/global.css';
import { AppProps } from 'next/app';

const ThemeWrapper = dynamic(() => import('../components/internal/ThemeWrapper').then((mod) => mod.ThemeWrapper), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable} font-sans`}>
      <ThemeWrapper>
        <Component {...pageProps}></Component>
      </ThemeWrapper>
    </main>
  );
}