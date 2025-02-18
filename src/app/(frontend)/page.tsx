import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './posts/page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="text-center">
          <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl mb-4">Curated Books</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A thoughtfully curated collection of books to inspire and enlighten your journey
          </p>
        </div>
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Sadhana Studio | Curated Books`,
    description: 'A thoughtfully curated collection of books to inspire and enlighten your journey',
  }
}
