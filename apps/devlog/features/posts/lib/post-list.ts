import { type PostMeta } from './post-frontmatter';

/**
 * 메타데이터 중에서 공개된 글만 필터링하고, 최신순으로 정렬한다.
 *
 * @param metas - 글 메타데이터 목록(순서 무관)
 * @returns 초안을 뺀, 최신순 메타데이터 목록
 */
export function selectPublishedPosts(metas: PostMeta[]): PostMeta[] {
  return metas
    .filter((meta) => !meta.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
