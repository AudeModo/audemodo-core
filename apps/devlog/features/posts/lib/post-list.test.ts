import { describe, expect, it } from 'vitest';

import { type PostMeta } from './post-frontmatter';
import { selectPublishedPosts } from './post-list';

function meta(slug: string, date: string, draft = false): PostMeta {
  return { slug, title: slug, date, draft };
}

describe('selectPublishedPosts', () => {
  it('초안을 빼고 최신순으로 정렬한다', () => {
    const result = selectPublishedPosts([
      meta('a', '2026-01-01'),
      meta('b', '2026-03-01'),
      meta('c', '2026-02-01', true),
    ]);
    expect(result.map((post) => post.slug)).toEqual(['b', 'a']);
  });
});
