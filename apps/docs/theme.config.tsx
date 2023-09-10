import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from 'next/image';

const config: DocsThemeConfig = {
  logo: (
    <div className="flex flex-row gap-1 items-center">
      <Image
        alt="Enterwell"
        width={40}
        height={40}
        src="https://enterwell.net/wp-content/uploads/2023/05/ew-logomark-monochrome-negative-64.x71089.svg" />
      <span>Enterwell {'<'}UI{' \\>'}</span>
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
  primaryHue: 8
}

export default config
