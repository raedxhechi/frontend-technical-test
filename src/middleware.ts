import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUser } from './services/users'
import type { User } from './types/user'
import { getLoggedUserId } from './utils/getLoggedUserId'

export async function middleware(request: NextRequest) {
  const isRoot = request.nextUrl.pathname === '/'
  let user: User | null = null

  try {
    user = await getUser(getLoggedUserId())
  } catch {
    return isRoot
      ? NextResponse.redirect(new URL('/conversations', request.url))
      : NextResponse.next()
  }

  if (!user) {
    return NextResponse.redirect(new URL('/user-not-found', request.url))
  }

  if (isRoot) {
    return NextResponse.redirect(new URL('/conversations', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/conversations', '/conversations/:path*'],
}
