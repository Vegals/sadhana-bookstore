'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, UserIcon, LogOutIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const router = useRouter()

  const isAuthPage = pathname === '/login' || pathname === '/create-account'

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
      })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <nav className="flex gap-4 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <div className="flex items-center gap-4 pl-2 border-l border-border">
        <Link href="/search" className="text-primary hover:text-primary/80 transition-colors">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5" />
        </Link>
        {!isAuthPage && (
          <>
            <Link href="/profile" className="text-primary hover:text-primary/80 transition-colors">
              <span className="sr-only">Account</span>
              <UserIcon className="w-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-primary hover:text-primary/80 transition-colors"
              aria-label="Log out"
            >
              <LogOutIcon className="w-5" />
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
