import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { evaluate } from 'next-mdx-remote-client/rsc';
import { type ReactNode } from 'react';

import { postFrontmatterSchema, type PostMeta } from './schema';

export type { PostMeta };
export type Post = { meta: PostMeta; content: ReactNode };

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

/*
 * @MEMO: gray-matter의 YAML 파서는 따옴표 없는 날짜를 Date 객체로 자동 변환하므로,
 * Date 객체를 ISO 문자열로 변환한 뒤, 앞 10자리(YYYY-MM-DD)만 추출하여 정규화한다.
 */
function normalize(data: Record<string, unknown>): Record<string, unknown> {
  if (data.date instanceof Date) {
    return { ...data, date: data.date.toISOString().slice(0, 10) };
  }
  return data;
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
  const frontmatter = postFrontmatterSchema.parse(normalize(data));
  return { slug, ...frontmatter };
}

export async function listPosts(): Promise<PostMeta[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const slugs = entries
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''));

  const metas = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await fs.readFile(
        path.join(POSTS_DIR, `${slug}.mdx`),
        'utf8',
      );
      return toMeta(slug, matter(raw).data);
    }),
  );

  return metas
    .filter((meta) => !meta.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  let raw: string;
  try {
    raw = await fs.readFile(path.join(POSTS_DIR, `${slug}.mdx`), 'utf8');
  } catch {
    return null;
  }

  const { data, content: body } = matter(raw);
  const meta = toMeta(slug, data);
  const { content } = await evaluate({ source: body });
  return { meta, content };
}
