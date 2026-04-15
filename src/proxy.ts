import { decrypt } from "@/app/lib/session";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.includes("admin");

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
