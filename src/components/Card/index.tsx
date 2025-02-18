'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group relative aspect-[2/3] overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-2',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative h-full w-full">
        {!metaImage && (
          <div className="h-full w-full bg-secondary flex items-center justify-center text-secondary-foreground">
            No image
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <div className="h-full">
            <Media
              resource={metaImage}
              className="h-full w-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 blur-0 group-hover:blur-[2px]"
              size="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {showCategories && hasCategories && (
            <div className="text-xs uppercase tracking-wider mb-3 text-secondary">
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category
                  const categoryTitle = titleFromCategory || 'Untitled category'
                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                }
                return null
              })}
            </div>
          )}
          {titleToUse && (
            <Link
              className="font-cormorant text-3xl font-medium leading-tight hover:text-primary-foreground transition-colors max-w-[90%]"
              href={href}
              ref={link.ref}
            >
              {titleToUse}
            </Link>
          )}
          {description && (
            <p className="mt-3 text-sm line-clamp-2 text-secondary/90 max-w-[90%]">
              {sanitizedDescription}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
