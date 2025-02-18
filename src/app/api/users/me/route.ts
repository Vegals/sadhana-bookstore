import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      console.log('No token found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })

    try {
      // Use Payload's auth method to get the current user
      const result = await payload.find({
        collection: 'users',
        depth: 1,
        req: {
          // @ts-ignore - Payload expects this shape
          cookies: {
            'payload-token': token,
          },
        },
      })

      console.log('Find result:', result)

      const user = result.docs[0]
      if (!user) {
        console.log('No user found')
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({ user })
    } catch (payloadError) {
      console.error('Payload error:', payloadError)
      throw payloadError
    }
  } catch (error) {
    console.error('Detailed error in GET /api/users/me:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'An error occurred while fetching the user', details: error.message },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { error: 'An error occurred while fetching the user' },
      { status: 500 },
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })
    const body = await req.json()

    // Get the current user first
    const result = await payload.find({
      collection: 'users',
      depth: 1,
      req: {
        // @ts-ignore - Payload expects this shape
        cookies: {
          'payload-token': token,
        },
      },
    })

    const user = result.docs[0]
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update the user using their actual ID
    const updateResult = await payload.update({
      collection: 'users',
      id: user.id,
      data: body,
      req: {
        // @ts-ignore - Payload expects this shape
        cookies: {
          'payload-token': token,
        },
      },
    })

    return NextResponse.json(updateResult)
  } catch (error) {
    console.error('Error updating user:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'An error occurred while updating the user', details: error.message },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { error: 'An error occurred while updating the user' },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })

    // Get the current user first
    const result = await payload.find({
      collection: 'users',
      depth: 1,
      req: {
        // @ts-ignore - Payload expects this shape
        cookies: {
          'payload-token': token,
        },
      },
    })

    const user = result.docs[0]
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete the user using their actual ID
    await payload.delete({
      collection: 'users',
      id: user.id,
      req: {
        // @ts-ignore - Payload expects this shape
        cookies: {
          'payload-token': token,
        },
      },
    })

    // Return response with cookie deletion
    const response = NextResponse.json({ success: true })
    response.cookies.delete('payload-token')
    return response
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'An error occurred while deleting the user', details: error.message },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { error: 'An error occurred while deleting the user' },
      { status: 500 },
    )
  }
}
