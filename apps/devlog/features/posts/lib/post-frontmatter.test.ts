import { describe, expect, it } from 'vitest';

import { parsePostMeta } from './post-frontmatter';

describe('parsePostMeta', () => {
  it('slug을 붙이고 draft를 false로 기본값 처리한다', () => {
    const meta = parsePostMeta('hello', { title: 'Hello', date: '2026-06-27' });
    expect(meta).toMatchObject({ slug: 'hello', title: 'Hello', draft: false });
  });

  it('Date 형태의 date를 ISO 날짜 문자열로 정규화한다', () => {
    const meta = parsePostMeta('d', {
      title: 'D',
      date: new Date('2026-06-27T00:00:00Z'),
    });
    expect(meta.date).toBe('2026-06-27');
  });

  it('필수 필드가 없으면 오류를 던진다', () => {
    expect(() => parsePostMeta('bad', { title: 'No date' })).toThrow();
  });
});
