import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '.'

export default function CreateAccount() {
  return (
    <div className="pt-32 pb-24">
      <div className="container max-w-lg">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create an account to access the blog content.
          </p>
        </div>
        <RegisterForm />
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-600">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create an account to access the blog content',
}
