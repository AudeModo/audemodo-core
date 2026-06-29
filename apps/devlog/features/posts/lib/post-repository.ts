import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { evaluate } from 'next-mdx-remote-client/rsc';
import { type ReactNode } from 'react';

import { parsePostMeta, type PostMeta } from './post-frontmatter';
import { selectPublishedPosts } from './post-list';

/** 렌더 가능한 본문까지 갖춘 글 한 편(메타 + 컴파일된 MDX). */
export type Post = { meta: PostMeta; content: ReactNode };

/** 글 원본(`.mdx`)이 모여 있는 디렉터리. */
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

/**
 * 모든 글의 메타데이터를 읽는다(본문 MDX 컴파일은 하지 않는다).
 * 디렉터리가 없으면 빈 목록을 반환한다.
 * 만약, frontmatter 검증에 실패하면 zod 검증 오류를 던진다.
 *
 * @returns 검증된 메타데이터 목록(정렬·필터 전)
 */
async function readAllMeta(): Promise<PostMeta[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const slugs = entries
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''));

  return Promise.all(
    slugs.map(async (slug) => {
      const raw = await fs.readFile(
        path.join(POSTS_DIR, `${slug}.mdx`),
        'utf8',
      );
      return parsePostMeta(slug, matter(raw).data);
    }),
  );
}

/**
 * 공개된 글 목록을 최신순으로 반환한다.
 * 목록 페이지가 콘텐츠에 접근하는 유일한 API.
 *
 * @returns 초안을 뺀, 최신순 메타데이터 목록
 */
export async function listPosts(): Promise<PostMeta[]> {
  return selectPublishedPosts(await readAllMeta());
}

/**
 * slug에 해당하는 글 한 편을 메타와 컴파일된 본문으로 반환한다.
 *
 * @param slug - 글 식별자(파일명)
 * @returns 글, 또는 해당 파일이 없으면 `null`
 */
export async function getPost(slug: string): Promise<Post | null> {
  let raw: string;
  try {
    raw = await fs.readFile(path.join(POSTS_DIR, `${slug}.mdx`), 'utf8');
  } catch {
    return null;
  }

  const { data, content: body } = matter(raw);
  const meta = parsePostMeta(slug, data);
  const { content } = await evaluate({ source: body });
  return { meta, content };
}
