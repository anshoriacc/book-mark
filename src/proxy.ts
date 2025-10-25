import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOrCreateAnon } from "@/lib/anon";

export async function proxy(_request: NextRequest) {
  try {
    const { setCookie } = await getOrCreateAnon();

    const response = NextResponse.next();

    if (setCookie) {
      response.headers.set("Set-Cookie", setCookie);
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
