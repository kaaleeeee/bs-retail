import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('auth_role')?.value;
  const { pathname } = request.nextUrl;

  // Paths that do not require authentication
  if (pathname.startsWith('/login') || pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.match(/\.(.*)$/)) {
    return NextResponse.next();
  }

  // If no role cookie, redirect to login
  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
