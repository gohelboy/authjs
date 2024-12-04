import { NextResponse } from "next/server";

export function middleware(req) {
  const session = req.cookies.get("next-auth.session-token");

  console.log("session", session);

  /* const isAuthPage = ["/auth/signin", "/auth/signup"].includes(
    req.nextUrl.pathname
  );

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  } */

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/signup", "/auth/signin", "/home"],
};
