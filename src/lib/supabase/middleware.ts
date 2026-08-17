import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublicKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicAdminRoute =
    pathname === "/admin/login" || pathname.startsWith("/admin/auth");

  if (pathname.startsWith("/admin") && !isPublicAdminRoute && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin/login" && user) {
    return NextResponse.redirect(new URL("/admin/oraciones", request.url));
  }

  if (pathname.startsWith("/visitas")) {
    const isLoginRoute = pathname === "/visitas/login";
    const isPendingRoute = pathname === "/visitas/pending";

    if (!user) {
      return isLoginRoute
        ? response
        : NextResponse.redirect(new URL("/visitas/login", request.url));
    }

    if (isLoginRoute) {
      return NextResponse.redirect(new URL("/visitas", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("approved, role")
      .eq("id", user.id)
      .single();

    const approved = profile?.approved ?? false;

    if (!approved) {
      return isPendingRoute
        ? response
        : NextResponse.redirect(new URL("/visitas/pending", request.url));
    }

    if (isPendingRoute) {
      return NextResponse.redirect(new URL("/visitas", request.url));
    }

    const isAdminOnlyRoute =
      pathname.startsWith("/visitas/admin") || pathname.startsWith("/visitas/familias");

    if (isAdminOnlyRoute && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/visitas", request.url));
    }
  }

  return response;
}
