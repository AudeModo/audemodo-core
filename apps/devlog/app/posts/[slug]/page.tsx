import { notFound } from 'next/navigation';

import { getPost, listPosts } from '@/features/posts';

type Params = { params: Promise<{ slug: string }> };

/**
 * 빌드 시 글마다 정적 페이지를 만들도록 slug 목록을 넘긴다.
 *
 * @returns 각 글의 slug를 담은 파라미터 목록
 */
export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * 글별 메타데이터를 생성한다.
 *
 * @param params - 라우트 파라미터(slug)
 * @returns 해당 글의 메타데이터, 없으면 빈 객체
 */
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const posts = await listPosts();
  const meta = posts.find((post) => post.slug === slug);
  return meta ? { title: meta.title, description: meta.description } : {};
}

/**
 * 글 한 편 페이지(`/posts/[slug]`).
 * seam(`getPost`)으로 메타와 본문을 받아 렌더하고, 없으면 404를 띄운다.
 *
 * @param params - 라우트 파라미터(slug)
 */
export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main>
      <article>
        <h1>{post.meta.title}</h1>
        <time dateTime={post.meta.date}>{post.meta.date}</time>
        {post.content}
      </article>
    </main>
  );
}
