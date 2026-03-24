import { defineQuery } from 'next-sanity';

// Blog Posts
export const GET_ALL_POSTS_QUERY = defineQuery(`
  * [_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    readTime,
    coverImage,
    category -> {
      title,
      "slug": slug.current,
      color
    },
    publishedAt
  }
`);

export const GET_ALL_POST_SLUGS_QUERY = defineQuery(`
  * [_type == "blogPost"] {
  "slug": slug.current
}
`);

export const GET_LATEST_POSTS_QUERY = defineQuery(`
  * [_type == "blogPost"] | order(publishedAt desc)[0...3] {
  _id,
    title,
    "slug": slug.current,
      excerpt,
      readTime,
      coverImage,
      category -> {
        title,
        "slug": slug.current,
        color
      },
      publishedAt
}
`);

export const GET_ALL_CATEGORIES_QUERY = defineQuery(`
  * [_type == "category"] | order(title asc) {
  _id,
    title,
    "slug": slug.current,
      color,
      description
}
`);

export const GET_POST_BY_SLUG_QUERY = defineQuery(`
  * [_type == "blogPost" && slug.current == $slug][0] {
  _id,
    title,
    "slug": slug.current,
      excerpt,
      readTime,
      coverImage,
      body,
      bibleVerses,
      callToAction,
      seoKeywords,
      author -> {
        name,
        "slug": slug.current,
        photo,
        role,
        bio
      },
      category -> {
        title,
        "slug": slug.current,
        color
      },
      publishedAt
}
`);

export const GET_POSTS_BY_CATEGORY_QUERY = defineQuery(`
  * [_type == "blogPost" && category -> slug.current == $categorySlug] | order(publishedAt desc) {
  _id,
    title,
    "slug": slug.current,
      excerpt,
      readTime,
      coverImage,
      category -> {
        title,
        "slug": slug.current,
        color
      },
      publishedAt
}
`);

// Testimonies
export const GET_ALL_TESTIMONIES_QUERY = defineQuery(`
  * [_type == "testimony"] {
  _id,
    personName,
    "slug": slug.current,
      headline,
      category,
      photo,
      shortVersion,
      church -> {
        name,
        city,
        zone
      }
}
`);

export const GET_TESTIMONY_BY_SLUG_QUERY = defineQuery(`
  * [_type == "testimony" && slug.current == $slug][0] {
  _id,
    personName,
    "slug": slug.current,
      headline,
      category,
      photo,
      videoUrl,
      shortVersion,
      fullStory,
      bibleVerse,
      church -> {
        name,
        city,
        zone,
        "slug": slug.current
      }
}
`);

// Churches
export const GET_ALL_CHURCHES_QUERY = defineQuery(`
  * [_type == "church"] | order(name asc) {
  _id,
    name,
    "slug": slug.current,
      city,
      zone,
      address,
      latitude,
      longitude,
      phone,
      whatsapp,
      extraEmail,
      image,
      pastorName
}
`);

export const GET_ALL_CHURCH_SLUGS_QUERY = defineQuery(`
  * [_type == "church" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const GET_CHURCH_BY_SLUG_QUERY = defineQuery(`
  * [_type == "church" && slug.current == $slug][0] {
  _id,
    name,
    "slug": slug.current,
      city,
      address,
      zone,
      latitude,
      longitude,
      phone,
      whatsapp,
      extraEmail,
      image,
      pastorName,
      serviceSchedule,
      photos
}
`);

export const GET_CHURCHES_BY_ZONE_QUERY = defineQuery(`
  * [_type == "church" && zone == $zone] | order(city asc) {
  _id,
    name,
    "slug": slug.current,
      city,
      zone,
      address,
      latitude,
      longitude,
      phone,
      whatsapp,
      extraEmail,
      image,
      pastorName
}
`);
