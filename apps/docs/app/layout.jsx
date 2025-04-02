import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
// Required for theme styles, previously was imported under the hood
import 'nextra-theme-docs/style.css'
import './global.css';
import { SlackIcon } from '../components/internal/icons/SlackIcon';
import Image from 'next/image';
import { Search } from 'nextra/components'
import { inter } from '../src/fonts';
import { theme } from "../components/theme";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

/*
      <>
        <meta name="msapplication-TileColor" content="#111111" />
        <meta name="theme-color" content="#111111" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content="Enterwell UI library."
        />
        <meta
          name="og:description"
          content="Enterwell UI library."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={socialCard} />
        <meta name="twitter:site:domain" content="enterwell.github.io" />
        <meta name="twitter:url" content="https://enterwell.github.io/ui" />
        <meta
          name="og:title"
          content={title ? title + ' - Enterwell UI' : 'Enterwell UI'}
        />
        <meta name="og:image" content={socialCard} />
        <meta name="apple-mobile-web-app-title" content="Enterwell UI" />
        <link rel="icon" href="/ui/favicon.png" type="image/png" />
        <link
          rel="icon"
          href="/ui/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/ui/favicon-dark.png"
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />
      </>
      */

/** @type {import('next').Metadata} */
export const metadata = {
  description: 'Enterwell UI documentation',
  title: 'Enterwell UI',
  appLinks: {
    web: { url: 'https://enterwell.github.io/ui' }
  }
  // socialCard: 'https://enterwell.github.io/ui/social-card.png',
  // twitter: 'enterwell',
  // image: 'https://enterwell.github.io/ui/social-card.png',
  // favicon: '/ui/favicon.png',
  // color: '#111111',
  // themeColor: '#111111',
  // msTileColor: '#111111',
  // ogTitle: 'Enterwell UI',
  // ogDescription: 'Enterwell UI library.',
  // ogSiteName: 'Enterwell UI',
  // ogImage: 'https://enterwell.github.io/ui/social-card.png',
  // twitterCard: 'summary_large_image',
  // twitterImage: 'https://enterwell.github.io/ui/social-card.png',
  // twitterSite: 'enterwell',
  // twitterDomain: 'enterwell.github.io',
  // twitterUrl: 'https://enterwell.github.io/ui',
  // appleMobileWebAppTitle: 'Enterwell UI',
  // faviconDark: '/ui/favicon-dark.svg',
  // faviconDarkPng: '/ui/favicon-dark.png', 
}

const navbar = <Navbar
  logo={(
    <div className="flex flex-row gap-1 items-center whitespace-nowrap">
      <Image
        alt="Enterwell"
        className="image--dark"
        width={40}
        height={40}
        src="https://enterwell.net/wp-content/uploads/2023/05/ew-logomark-monochrome-negative-64.x71089.svg" />
      <Image
        alt="Enterwell"
        className="image--light"
        width={40}
        height={40}
        src="https://enterwell.net/wp-content/uploads/2023/05/ew-logomark-monochrome-positive-64.x71089.svg" />
      <span className="text-xs sm:text-sm md:text-lg">Enterwell {'<'}UI{' \\>'}</span>
    </div>
  )}
  projectLink="https://github.com/enterwell/ui"
  chatLink='https://enterwell.slack.com/archives/C03MRCRLFC0'
  chatIcon={(<SlackIcon width={24} height={24} />)} />
const footer = (
  <Footer className="flex-col items-center md:items-start">
    MIT {new Date().getFullYear()} - <a href="https://enterwell.net">Enterwell d.o.o.</a>
  </Footer>
)

export default async function RootLayout({ children }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
        backgroundColor={{
          dark: 'rgb(0, 0, 0)',
          light: 'rgb(255, 255, 255)'
        }}
        color={{
          hue: { dark: 8, light: 8 },
          saturation: { dark: 0, light: 0 }
        }}
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body className={`${inter.variable} font-sans`}>
        <AppRouterCacheProvider options={{ key: 'css', enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <Layout
              search={<Search />}
              navbar={navbar}
              pageMap={await getPageMap()}
              docsRepositoryBase="https://github.com/enterwell/ui/tree/stage/apps/docs"
              editLink="Edit this page on GitHub"
              sidebar={{ defaultMenuCollapseLevel: 1 }}
              footer={footer}
            // ...Your additional theme config options
            >
              {children}
            </Layout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}