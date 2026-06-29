import { z } from 'zod';

export const postFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(), // ISO (YYYY-MM-DD).
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
export type PostMeta = PostFrontmatter & { slug: string };
