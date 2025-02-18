import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = [
  '/login',
  '/create-account',
  '/api',
  '/_next',
  '/favicon.ico',
  '/assets',
  '/admin',
] // Add any public paths here

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow public paths
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get('payload-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
