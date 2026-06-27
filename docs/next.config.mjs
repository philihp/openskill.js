import createMDX from '@next/mdx'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

const isPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  basePath: isPages ? '/openskill.js' : '',
  assetPrefix: isPages ? '/openskill.js/' : '',
  trailingSlash: true,
  images: { unoptimized: true },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})

export default withMDX(nextConfig)
