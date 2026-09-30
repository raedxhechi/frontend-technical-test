import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUser } from './services/users'
import { getLoggedUserId } from './utils/getLoggedUserId'

export async function middleware(request: NextRequest) {
  const user = await getUser(getLoggedUserId())

  if (!user) {
    return NextResponse.redirect(new URL('/user-not-found', request.url))
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/conversations', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/conversations', '/conversations/:path*'],
}
