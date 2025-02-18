import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border">
      <div className="container py-12 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo className="text-primary dark:text-primary-foreground" />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-6 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-6">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-primary hover:text-primary/80 dark:text-primary-foreground dark:hover:text-primary-foreground/80 transition-colors"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
