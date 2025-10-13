import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode';

// Definisikan tipe untuk payload token agar lebih aman
interface DecodedToken {
  exp: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Jika pengguna mencoba mengakses halaman login
  if (pathname.startsWith('/login')) {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Jika token valid dan belum kedaluwarsa, arahkan ke dashboard
        if (decoded.exp * 1000 > Date.now()) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch (error) {
        // Jika token tidak valid, hapus cookie yang salah dan izinkan ke halaman login
        const response = NextResponse.next();
        response.cookies.set('auth_token', '', { maxAge: 0 });
        response.cookies.set('user_role', '', { maxAge: 0 });
        return response;
      }
    }
    // Jika tidak ada token, izinkan akses ke halaman login
    return NextResponse.next();
  }

  // Untuk semua halaman yang dilindungi (selain login)
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Validasi token untuk halaman yang dilindungi
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Periksa apakah token sudah kedaluwarsa
    if (decoded.exp * 1000 < Date.now()) {
      // Buat respons untuk redirect ke login
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Hapus cookie yang sudah kedaluwarsa
      response.cookies.set('auth_token', '', { maxAge: 0 });
      response.cookies.set('user_role', '', { maxAge: 0 });
      return response;
    }
  } catch (error) {
    // Jika token tidak bisa di-decode (format salah), redirect ke login
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Hapus cookie yang salah
    response.cookies.set('auth_token', '', { maxAge: 0 });
    response.cookies.set('user_role', '', { maxAge: 0 });
    return response;
  }

  // Jika token valid, lanjutkan ke halaman yang dituju
  return NextResponse.next()
}

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico?)$).*)'],
  
    // Jalankan untuk semua path kecuali yang di bawah ini
 
}

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('auth_token')?.value
//   const { pathname } = request.nextUrl

//   if (!token && pathname !== '/login') {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   if (token && pathname === '/login') {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }
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

