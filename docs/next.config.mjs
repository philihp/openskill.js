import createMDX from '@next/mdx'

// The site is served from the root of its custom domain
// (https://openskill.philihp.com), so it needs no basePath.
const nextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  trailingSlash: true,
  images: { unoptimized: true },
}

// Turbopack, the default bundler in Next.js 16, passes loader options to
// Rust, so plugins must be named as strings, not imported as functions.
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-slug', ['rehype-autolink-headings', { behavior: 'wrap' }]],
  },
})

export default withMDX(nextConfig)
