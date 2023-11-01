import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";


export async function middleware(req: NextRequest) {
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_URL })

  const requestedPage = req.nextUrl.pathname
  if (!session) {
    if (requestedPage.startsWith('/api')) {
      return new Response(JSON.stringify({ message: 'No autorizado' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    };

    const url = req.nextUrl.clone()

    url.pathname = '/auth/login'
    url.search = `p=${requestedPage}`

    return NextResponse.redirect(url)
  }

  const validRoles = ['admin', 'super-user', 'SEO']

  if (requestedPage.startsWith('/api/admin') && !validRoles.includes(session.user.role)) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  if (requestedPage.startsWith('/admin') && !validRoles.includes(session.user.role)) {
    return NextResponse.redirect(new URL('/', req.url));
  };

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/orders/:path*",
    "/admin/:path*",
    "/api/orders/:path*",
    "/api/admin/:path*"
  ],
};