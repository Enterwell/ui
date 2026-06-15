import { rehypeComponent } from './lib/rehype-component.js';
import nextra from 'nextra';

// Node 25 exposes a partial localStorage global without a backing file in this
// environment. Server build tooling should see browser storage as unavailable.
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: undefined
});

const withNextra = nextra({
  mdxOptions: {
    rehypePlugins: [
      rehypeComponent
    ]
  },
  defaultShowCopyCode: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: "/ui",
  // eslint: {
  //   ignoreDuringBuilds: true
  // },
  images: {
    unoptimized: true,
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
