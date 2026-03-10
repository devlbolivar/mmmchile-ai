import { type SchemaTypeDefinition } from 'sanity'
import { blockContent } from './blockContent'
import { category } from './category'
import { author } from './author'
import { blogPost } from './blogPost'
import { testimony } from './testimony'
import { church } from './church'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [blockContent, category, author, blogPost, testimony, church],
}
