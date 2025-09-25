import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('auth_token')?.value
//   const { pathname } = request.nextUrl

//   // Jika user tidak punya token dan mencoba mengakses halaman yang dilindungi
//   if (!token && pathname !== '/login') {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   // Jika user sudah punya token dan mencoba kembali ke halaman login
//   if (token && pathname === '/login') {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   return NextResponse.next()
// }

// // Konfigurasi ini memastikan middleware hanya berjalan pada halaman yang relevan
// export const config = {
//   matcher: [
//     /*
//      * Cocokkan semua path, kecuali untuk:
//      * - /api routes
//      * - /_next/static (file statis)
//      * - /_next/image (optimasi gambar)
//      * - favicon.ico (file ikon)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }

