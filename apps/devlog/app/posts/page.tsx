import Link from 'next/link';

import { listPosts } from '@/lib/content';

export default async function PostsPage() {
  const posts = await listPosts();

  return (
    <main>
      <h1>글</h1>
      {posts.length === 0 ? (
        <p>아직 글이 없다.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                <h2>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h2>
                <time dateTime={post.date}>{post.date}</time>
                {post.description ? <p>{post.description}</p> : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
