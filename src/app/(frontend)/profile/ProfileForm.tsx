'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/payload-types'

export const ProfileForm: React.FC<{ user: User }> = ({ user }) => {
  const [firstName, setFirstName] = useState(user.name?.split(' ')[0] || '')
  const [lastName, setLastName] = useState(user.name?.split(' ')[1] || '')
  const [email, setEmail] = useState(user.email || '')
  const [message, setMessage] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      setMessage('Profile updated successfully')
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user.email) {
      setMessage('Please enter your email correctly to confirm deletion')
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete account')
      }

      // Clear any auth tokens/cookies
      await fetch('/api/users/logout', {
        method: 'POST',
      })

      router.push('/login?deleted=true')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* Profile Information Section */}
      <section>
        <h2 className="text-xl mb-6">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {message && (
            <div
              className={`p-4 rounded-lg text-sm ${
                message.includes('error') || message.includes('failed')
                  ? 'bg-primary/5 text-primary'
                  : 'bg-success/10 text-success'
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm text-muted-foreground">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/20 border-0 rounded-lg focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm text-muted-foreground">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/20 border-0 rounded-lg focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-secondary/20 border-0 rounded-lg focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-foreground py-3 px-6 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* Security Section */}
      <section className="pt-6 border-t border-border">
        <h2 className="text-xl mb-6">Security</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Change your password or update your security settings.
          </p>
          <button
            type="button"
            onClick={() => router.push('/change-password')}
            className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground py-3 px-6 rounded-lg transition-colors"
          >
            Change Password
          </button>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section className="pt-6 border-t border-border">
        <h2 className="text-xl mb-6 text-primary">Danger Zone</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          {isDeleting ? (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email to confirm"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/20 border-0 rounded-lg focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="bg-primary/10 hover:bg-primary/20 text-primary py-3 px-6 rounded-lg transition-colors"
                >
                  Confirm Deletion
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleting(false)
                    setDeleteConfirmation('')
                  }}
                  className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground py-3 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsDeleting(true)}
              className="bg-primary/10 hover:bg-primary/20 text-primary py-3 px-6 rounded-lg transition-colors"
            >
              Delete Account
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
