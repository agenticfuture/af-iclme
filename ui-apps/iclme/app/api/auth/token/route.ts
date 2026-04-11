import { NextRequest, NextResponse } from "next/server"

/**
 * Token Exchange API Route
 * 
 * Exchanges authorization code for access tokens with Keycloak
 */
export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json()

        if (!code) {
            return NextResponse.json(
                { error: "Authorization code is required" },
                { status: 400 }
            )
        }

        const keycloakUrl = process.env.AUTH_KEYCLOAK_ISSUER?.replace("/realms/master", "")
        const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "master"
        const clientId = process.env.AUTH_KEYCLOAK_ID
        const clientSecret = process.env.AUTH_KEYCLOAK_SECRET

        const redirectUri = `${request.nextUrl.origin}/auth/callback`

        // Exchange code for tokens
        const tokenResponse = await fetch(
            `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: redirectUri,
                    client_id: clientId!,
                    client_secret: clientSecret!,
                }),
            }
        )

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text()
            console.error("Token exchange failed:", errorText)
            return NextResponse.json(
                { error: "Token exchange failed" },
                { status: tokenResponse.status }
            )
        }

        const tokens = await tokenResponse.json()

        // Get user info
        const userInfoResponse = await fetch(
            `${keycloakUrl}/realms/${realm}/protocol/openid-connect/userinfo`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                },
            }
        )

        if (!userInfoResponse.ok) {
            console.error("User info fetch failed")
            return NextResponse.json(
                { error: "Failed to fetch user info" },
                { status: userInfoResponse.status }
            )
        }

        const userInfo = await userInfoResponse.json()

        // Create session cookie
        const response = NextResponse.json({
            access_token: tokens.access_token,
            user: {
                id: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
            },
        })

        // Set secure HTTP-only cookie for session
        response.cookies.set("session_token", tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: tokens.expires_in || 3600,
            path: "/",
        })

        return response
    } catch (error) {
        console.error("Token exchange error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
