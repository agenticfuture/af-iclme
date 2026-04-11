"use client"

import { useState } from "react"
import Link from "next/link"
import { Bot, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SocialAuth } from "@/components/auth/social-auth"
import { initiateLogin } from "@/lib/keycloak-client"
import { validateEmail } from "@/lib/validation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailLogin = () => {
        const validation = validateEmail(email)
        if (!validation.isValid) {
            setEmailError(validation.error || "Invalid email")
            return
        }

        setEmailError("")
        setIsLoading(true)
        initiateLogin()
    }

    const handleSocialLogin = (provider: string) => {
        setIsLoading(true)
        // In production, this would redirect to Keycloak with the specific provider
        // For now, using the default Keycloak login
        initiateLogin()
    }

    const handleEmailChange = (value: string) => {
        setEmail(value)
        if (emailError) setEmailError("")
    }

    return (
        <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[440px] z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Logo */}
                <Link href="/" className="flex flex-col items-center gap-4 group mx-auto w-fit">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Bot className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">ServiceGen</h1>
                        <p className="text-sm text-white/40">Sign in to your account</p>
                    </div>
                </Link>

                {/* Login Card */}
                <div className="p-8 rounded-[32px] border border-white/5 bg-white/2 backdrop-blur-2xl shadow-2xl">
                    <div className="space-y-6">
                        <div className="space-y-2 text-center mb-8">
                            <h2 className="text-xl font-semibold">Welcome back</h2>
                            <p className="text-sm text-white/40">Choose your preferred sign in method</p>
                        </div>

                        {/* Social Login */}
                        <SocialAuth
                            mode="login"
                            onGoogleClick={() => handleSocialLogin("google")}
                            onAppleClick={() => handleSocialLogin("apple")}
                            onMicrosoftClick={() => handleSocialLogin("microsoft")}
                            isLoading={isLoading}
                        />

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#020203] px-2 text-white/40">Or continue with email</span>
                            </div>
                        </div>

                        {emailError && (
                            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                                <AlertDescription>{emailError}</AlertDescription>
                            </Alert>
                        )}

                        {/* Email Login */}
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-white/60 ml-1">Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        id="email"
                                        placeholder="name@company.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => handleEmailChange(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleEmailLogin}
                                disabled={isLoading}
                                className="h-12 rounded-xl bg-white text-black hover:bg-white/90 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in with Email"
                                )}
                            </Button>
                        </div>

                        <div className="text-center">
                            <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <p className="text-center text-sm text-white/40">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-white hover:underline underline-offset-4">
                        Create account
                    </Link>
                </p>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-6 opacity-40">
                    <div className="text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-green-500" />
                            <span>SOC 2 Certified</span>
                        </div>
                    </div>
                    <div className="text-xs">ISO 27001</div>
                    <div className="text-xs">GDPR Compliant</div>
                </div>
            </div>
        </div>
    )
}
