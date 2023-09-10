import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import Image from 'next/image';
import { useConfig } from 'nextra-theme-docs';
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  logo: (
    <div className="flex flex-row gap-1 items-center">
      <Image
        alt="Enterwell"
        width={40}
        height={40}
        src="https://enterwell.net/wp-content/uploads/2023/05/ew-logomark-monochrome-negative-64.x71089.svg" />
      <span className="text-xs sm:text-sm md:text-lg">Enterwell {'<'}UI{' \\>'}</span>
    </div>
  ),
  project: {
    link: 'https://github.com/enterwell/ui',
  },
  chat: {
    link: 'https://enterwell.slack.com/archives/C03MRCRLFC0',
    icon: (
      <Image alt="Slack" width={24} height={24} src='/ui/assets/slack.svg' />
    )
  },
  docsRepositoryBase: 'https://github.com/enterwell/ui',
  footer: {
    text: 'Enterwell UI Docs',
  },
  primaryHue: 8,
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s - Enterwell UI'
      }
    }
  },
  head: function useHead() {
    const { title } = useConfig();
    const socialCard = 'https://enterwell.github.io/ui/og.jpeg';

    return (
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/favicon-dark.png"
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />
      </>
    )
  }
}

export default config
