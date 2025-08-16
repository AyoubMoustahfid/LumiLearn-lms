


// export const config = {
    //     matcher: ["/admin/:path*"]
    // }
    
import { NextRequest, NextResponse } from "next/server";
import {getSessionCookie} from "better-auth/cookies"
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { env } from "./lib/env";

const aj = arcjet({
  key: env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
        "STRIPE_WEBHOOK"
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
      ],
    }),
  ],
});

async function authMiddleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Only apply CORS for API requests
    if (request.nextUrl.pathname.startsWith("/api/")) {
        const res = NextResponse.next()
        res.headers.set("Access-Control-Allow-Credentials", "true")
        res.headers.set("Access-Control-Allow-Origin", request.headers.get("origin") || "")
        res.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT")
        res.headers.set(
            "Access-Control-Allow-Headers",
            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
        )
        return res
    }

    return NextResponse.next()
}

export const config = {
  // matcher tells Next.js which routes to run the middleware on.
  // This runs the middleware on all routes except for static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
// Pass any existing middleware with the optional existingMiddleware prop
export default createMiddleware(aj, async (request: NextRequest) => {
    if(request.nextUrl.pathname.startsWith("/admin")){
        return authMiddleware(request)
    }

    return NextResponse.next()
});