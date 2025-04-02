import { rehypeComponent } from './lib/rehype-component.js';
import nextra from 'nextra';

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
