import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(200),
      excerpt: s.string().max(1000),
      date: s.isodate(),
      author: s.string(),
      category: s.string(),
      published: s.boolean().default(true),
      needsTranslation: s.boolean().optional(),
      metadata: s.metadata(), // Auto-generates readingTime & wordCount
      content: s.mdx(),
    })
    .transform((data, { meta }) => {
      // Extract slug from folder name and locale from filename
      // meta.path = "blog/mvp-4-week-sprint-guide/en.mdx"
      const pathParts = meta.path.split('/')
      const fileName = pathParts[pathParts.length - 1] // "en.mdx"
      const folderName = pathParts[pathParts.length - 2] // "mvp-4-week-sprint-guide"
      const locale = fileName.replace('.mdx', '') as 'en' | 'he'

      return {
        ...data,
        slug: folderName,
        locale,
        url: `/${locale}/blog/${folderName}`,
      }
    }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeHighlight,
    ],
  },
})
