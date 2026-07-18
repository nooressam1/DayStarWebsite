import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase auth session on every request and syncs the cookies.
 * Required because Server Components can't write cookies on their own.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: keep this call directly after creating the client. It refreshes
  // the token; removing it can randomly log users out.
  const { data: { user } } = await supabase.auth.getUser();

  const url = new URL(request.url);
  const isProtectedPath = 
    url.pathname.startsWith('/account') || 
    url.pathname.startsWith('/checkout') || 
    url.pathname.startsWith('/order-confirmed');

  if (!user && isProtectedPath) {
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));
    
    // Copy the cookies from the supabaseResponse to the redirectResponse
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        expires: cookie.expires,
      });
    });
    
    return redirectResponse;
  }

  return supabaseResponse;
}
