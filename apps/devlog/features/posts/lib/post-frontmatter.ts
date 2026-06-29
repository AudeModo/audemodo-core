import { z } from 'zod';

/**
 * 글 frontmatter의 검증 스키마. 불만족 할 경우 빌드에서 실패한다.
 */
const postFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(), // ISO (YYYY-MM-DD).
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
});

/** 글 frontmatter의 타입. */
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

/**
 * 글 한 편의 메타데이터.
 * {@link PostFrontmatter} 타입에 `slug`를 더한 것.
 */
export type PostMeta = PostFrontmatter & { slug: string };

/**
 * gray-matter의 YAML 파서는 따옴표 없는 날짜를 `Date` 객체로 바꾼다.
 * 스키마는 문자열을 기대하므로, `Date`면 ISO 날짜 문자열로 되돌린다.
 *
 * @param data - gray-matter가 파싱한 원시 frontmatter
 * @returns date가 문자열로 정규화된 frontmatter
 */
function normalizeDate(data: Record<string, unknown>): Record<string, unknown> {
  if (data.date instanceof Date) {
    return { ...data, date: data.date.toISOString().slice(0, 10) };
  }
  return data;
}

/**
 * 원시 frontmatter를 검증된 {@link PostMeta}로 바꾼다.
 * frontmatter 형식이 잘못된 글을 빌드 타입에 검출한다.
 *
 * @param slug - 파일명에서 얻은 글 식별자
 * @param data - gray-matter가 파싱한 원시 frontmatter
 * @returns slug가 붙은 검증된 메타데이터
 * @throws 필수 필드가 없거나 타입이 어긋나면 zod 검증 오류를 던진다
 */
export function parsePostMeta(
  slug: string,
  data: Record<string, unknown>,
): PostMeta {
  const frontmatter = postFrontmatterSchema.parse(normalizeDate(data));
  return { slug, ...frontmatter };
}
