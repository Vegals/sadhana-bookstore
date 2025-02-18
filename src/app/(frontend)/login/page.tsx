import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '.'

export default function Login() {
  return (
    <div className="pt-32 pb-24">
      <div className="container max-w-lg">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Login</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please login to access the blog content.
          </p>
        </div>
        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/create-account" className="text-blue-500 hover:text-blue-600">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to access the blog content',
}
