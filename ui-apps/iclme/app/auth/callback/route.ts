import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
    }

    // Get code_verifier from cookies
    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get("pkce_verifier")?.value;

    try {
        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/auth/callback`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(codeVerifier && { "Cookie": `pkce_verifier=${codeVerifier}` })
                },
                body: JSON.stringify({ code }),
                credentials: "include"
            }
        );

        if (!backendRes.ok) {
            console.error("Backend auth failed:", await backendRes.text());
            return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
        }

        // Forward session cookie from backend to frontend
        const sessionCookie = backendRes.headers.get("set-cookie");
        const response = NextResponse.redirect(new URL("/dashboard", request.url));

        if (sessionCookie) {
            response.headers.set("set-cookie", sessionCookie);
        }

        return response;

    } catch (error) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(new URL("/login?error=server_error", request.url));
    }
}
