import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Clear the auth cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete('payload-token')
    return response
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json({ error: 'An error occurred while logging out' }, { status: 500 })
  }
}
