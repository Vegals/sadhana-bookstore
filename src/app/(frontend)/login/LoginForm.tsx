'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          collection: 'users',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Login failed')
      }

      // Successful login
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <h1 className="font-cormorant text-4xl text-center mb-8">Welcome Back</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-primary/5 text-primary dark:text-primary-foreground p-4 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-secondary/20 border-0 rounded-lg focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/50"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-secondary/20 border-0 rounded-lg focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/50"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
