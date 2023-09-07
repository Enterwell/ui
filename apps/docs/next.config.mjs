import { rehypeComponent } from './lib/rehype-component.mjs';
import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    rehypePlugins: [
      rehypeComponent
    ]
  },
  defaultShowCopyCode: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'enterwell.net',
        pathname: '/wp-content/uploads/**'
      }
    ]
  }
}

export default withNextra(nextConfig);
