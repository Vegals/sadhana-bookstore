import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-12 gap-x-12 lg:gap-y-16 lg:gap-x-16 xl:gap-x-20">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4 max-w-[240px] mx-auto w-full" key={index}>
                  <Card className="h-full" doc={result} relationTo="posts" showCategories />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
