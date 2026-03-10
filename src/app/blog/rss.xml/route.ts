import { sanityFetch } from '@/lib/sanity/client';
import { GET_ALL_POSTS_QUERY } from '@/lib/sanity/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mmmchile.cl';

export async function GET() {
  const posts = await sanityFetch<any[]>({ query: GET_ALL_POSTS_QUERY });

  const items = posts.map((post) => {
    const url = `${BASE_URL}/blog/${post.slug}`;
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category><![CDATA[${post.category?.title || 'Generales'}]]></category>${post.author ? `\n      <author><![CDATA[${post.author.name}]]></author>` : ''}
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>MMM Chile — Blog Evangelístico</title>
    <link>${BASE_URL}/blog</link>
    <description>Artículos de fe, vida cristiana y evangelización del Movimiento Misionero Mundial en Chile.</description>
    <language>es-CL</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/og-default.png</url>
      <title>MMM Chile</title>
      <link>${BASE_URL}/blog</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
