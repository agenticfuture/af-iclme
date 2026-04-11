"use client"

import { Button } from "@/components/ui/button"
import { Chrome, Apple } from "lucide-react"

interface SocialAuthProps {
    mode: "login" | "register"
    onGoogleClick: () => void
    onAppleClick: () => void
    onMicrosoftClick: () => void
    isLoading?: boolean
}

export function SocialAuth({ mode, onGoogleClick, onAppleClick, onMicrosoftClick, isLoading = false }: SocialAuthProps) {
    const actionText = mode === "login" ? "Sign in" : "Sign up"

    return (
        <div className="grid gap-3">
            <Button
                variant="outline"
                onClick={onGoogleClick}
                disabled={isLoading}
                className="h-11 bg-white/5 border-white/10 hover:bg-white/10 transition-all"
            >
                <Chrome className="mr-2 h-4 w-4" />
                {actionText} with Google
            </Button>

            <Button
                variant="outline"
                onClick={onAppleClick}
                disabled={isLoading}
                className="h-11 bg-white/5 border-white/10 hover:bg-white/10 transition-all"
            >
                <Apple className="mr-2 h-4 w-4" />
                {actionText} with Apple
            </Button>

            <Button
                variant="outline"
                onClick={onMicrosoftClick}
                disabled={isLoading}
                className="h-11 bg-white/5 border-white/10 hover:bg-white/10 transition-all"
            >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23" fill="currentColor">
                    <path d="M0 0h11v11H0z" />
                    <path d="M12 0h11v11H12z" />
                    <path d="M0 12h11v11H0z" />
                    <path d="M12 12h11v11H12z" />
                </svg>
                {actionText} with Microsoft
            </Button>
        </div>
    )
}
