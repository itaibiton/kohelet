// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post (English)",
      required: true
    },
    title_he: {
      type: "string",
      description: "The title of the post (Hebrew)",
      required: false
    },
    excerpt: {
      type: "string",
      description: "A brief excerpt or summary of the post (English)",
      required: true
    },
    excerpt_he: {
      type: "string",
      description: "A brief excerpt or summary of the post (Hebrew)",
      required: false
    },
    date: {
      type: "date",
      description: "The publication date of the post",
      required: true
    },
    author: {
      type: "string",
      description: "The author of the post",
      required: true
    },
    authorAvatar: {
      type: "string",
      description: "URL to the author's avatar image",
      required: false
    },
    category: {
      type: "string",
      description: "The category of the post (English)",
      required: true
    },
    category_he: {
      type: "string",
      description: "The category of the post (Hebrew)",
      required: false
    },
    thumbnail: {
      type: "string",
      description: "URL to the post's thumbnail image",
      required: false
    },
    published: {
      type: "boolean",
      description: "Whether the post is published",
      required: false,
      default: true
    }
  },
  computedFields: {
    slug: {
      type: "string",
      description: "The URL slug derived from the file name",
      resolve: (post) => post._raw.flattenedPath.split("/").pop() || ""
    },
    url: {
      type: "string",
      description: "The full URL path to the post",
      resolve: (post) => {
        const slug = post._raw.flattenedPath.split("/").pop() || "";
        return `/blog/${slug}`;
      }
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content/blog",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeHighlight,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["anchor"]
          }
        }
      ]
    ]
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-MGQ4E5FO.mjs.map
