import { notFound } from 'next/navigation';

import { getPost, listPosts } from '@/lib/content';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const posts = await listPosts();
  const meta = posts.find((post) => post.slug === slug);
  return meta ? { title: meta.title, description: meta.description } : {};
}

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
