import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileForm } from './ProfileForm'

export const metadata = {
  title: 'Profile | Sadhana Studio',
  description: 'Manage your profile settings',
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    redirect('/login')
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
      credentials: 'include',
      headers: {
        Cookie: `payload-token=${token}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Profile fetch error:', {
        status: res.status,
        statusText: res.statusText,
        error: errorData,
        token: token ? 'present' : 'missing',
      })
      throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    console.log('Profile response:', data)

    if (!data.user) {
      console.error('No user in response:', data)
      redirect('/login')
    }

    return (
      <div className="pt-24 pb-24">
        <div className="container max-w-2xl">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl mb-3">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8">
            <ProfileForm user={data.user} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in profile page:', error)
    redirect('/login')
  }
}
