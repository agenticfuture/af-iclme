"use client"

import { useState } from "react"
import Link from "next/link"
import { Bot, Mail, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { SocialAuth } from "@/components/auth/social-auth"
import { initiateRegistration } from "@/lib/keycloak-client"
import {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateName,
    validateCheckbox,
    getPasswordStrength
} from "@/lib/validation"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const passwordStrength = getPasswordStrength(formData.password)

    const handleFieldChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }))
        validateField(field)
    }

    const validateField = (field: string) => {
        let validation

        switch (field) {
            case "firstName":
                validation = validateName(formData.firstName, "First name")
                break
            case "lastName":
                validation = validateName(formData.lastName, "Last name")
                break
            case "email":
                validation = validateEmail(formData.email)
                break
            case "password":
                validation = validatePassword(formData.password)
                break
            case "confirmPassword":
                validation = validatePasswordMatch(formData.password, formData.confirmPassword)
                break
            case "acceptTerms":
                validation = validateCheckbox(formData.acceptTerms, "Terms and conditions")
                break
            default:
                return
        }

        if (!validation.isValid) {
            setErrors(prev => ({ ...prev, [field]: validation.error || "" }))
        }
    }

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {}

        const firstNameVal = validateName(formData.firstName, "First name")
        if (!firstNameVal.isValid) newErrors.firstName = firstNameVal.error || ""

        const lastNameVal = validateName(formData.lastName, "Last name")
        if (!lastNameVal.isValid) newErrors.lastName = lastNameVal.error || ""

        const emailVal = validateEmail(formData.email)
        if (!emailVal.isValid) newErrors.email = emailVal.error || ""

        const passwordVal = validatePassword(formData.password)
        if (!passwordVal.isValid) newErrors.password = passwordVal.error || ""

        const confirmPasswordVal = validatePasswordMatch(formData.password, formData.confirmPassword)
        if (!confirmPasswordVal.isValid) newErrors.confirmPassword = confirmPasswordVal.error || ""

        const termsVal = validateCheckbox(formData.acceptTerms, "Terms and conditions")
        if (!termsVal.isValid) newErrors.acceptTerms = termsVal.error || ""

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleEmailSubmit = () => {
        if (!validateAllFields()) {
            return
        }

        setIsLoading(true)
        initiateRegistration()
    }

    const handleSocialRegister = (provider: string) => {
        setIsLoading(true)
        // In production, redirect to Keycloak with specific provider
        initiateRegistration()
    }

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return "bg-red-500"
        if (passwordStrength === 2) return "bg-orange-500"
        if (passwordStrength === 3) return "bg-yellow-500"
        return "bg-green-500"
    }

    const getStrengthText = () => {
        if (passwordStrength <= 1) return "Weak"
        if (passwordStrength === 2) return "Fair"
        if (passwordStrength === 3) return "Good"
        return "Strong"
    }

    return (
        <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[480px] z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Logo */}
                <Link href="/" className="flex flex-col items-center gap-4 group mx-auto w-fit">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Bot className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">ServiceGen</h1>
                        <p className="text-sm text-white/40">Create your account</p>
                    </div>
                </Link>

                {/* Register Card */}
                <div className="p-8 rounded-[32px] border border-white/5 bg-white/2 backdrop-blur-2xl shadow-2xl">
                    <div className="space-y-6">
                        <div className="space-y-2 text-center mb-6">
                            <h2 className="text-xl font-semibold">Get started for free</h2>
                            <p className="text-sm text-white/40">Choose your preferred sign up method</p>
                        </div>

                        {/* Social Registration */}
                        <SocialAuth
                            mode="register"
                            onGoogleClick={() => handleSocialRegister("google")}
                            onAppleClick={() => handleSocialRegister("apple")}
                            onMicrosoftClick={() => handleSocialRegister("microsoft")}
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

                        {/* Email Registration Form */}
                        <div className="grid gap-4">
                            {/* Name Fields - Side by Side */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName" className="text-white/60 ml-1">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => handleFieldChange("firstName", e.target.value)}
                                        onBlur={() => handleBlur("firstName")}
                                        disabled={isLoading}
                                        className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <p className="text-xs text-red-400">{errors.firstName}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="lastName" className="text-white/60 ml-1">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => handleFieldChange("lastName", e.target.value)}
                                        onBlur={() => handleBlur("lastName")}
                                        disabled={isLoading}
                                        className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                    />
                                    {touched.lastName && errors.lastName && (
                                        <p className="text-xs text-red-400">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-white/60 ml-1">Work Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        id="email"
                                        placeholder="john@company.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleFieldChange("email", e.target.value)}
                                        onBlur={() => handleBlur("email")}
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        disabled={isLoading}
                                        className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                    />
                                </div>
                                {touched.email && errors.email && (
                                    <p className="text-xs text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Password with strength indicator */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-white/60 ml-1">Password</Label>
                                <Input
                                    id="password"
                                    placeholder="Create a strong password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleFieldChange("password", e.target.value)}
                                    onBlur={() => handleBlur("password")}
                                    disabled={isLoading}
                                    className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                />
                                {formData.password && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Progress value={(passwordStrength / 4) * 100} className="h-2 flex-1" />
                                            <span className={`text-xs ${getStrengthColor().replace('bg-', 'text-')}`}>
                                                {getStrengthText()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {touched.password && errors.password && (
                                    <p className="text-xs text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword" className="text-white/60 ml-1">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    placeholder="Re-enter your password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                                    onBlur={() => handleBlur("confirmPassword")}
                                    disabled={isLoading}
                                    className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                />
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <p className="text-xs text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start space-x-3 pt-2">
                                <Checkbox
                                    id="terms"
                                    checked={formData.acceptTerms}
                                    onCheckedChange={(checked) => handleFieldChange("acceptTerms", checked === true)}
                                    disabled={isLoading}
                                    className="mt-1"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="terms"
                                        className="text-sm text-white/60 leading-relaxed cursor-pointer"
                                    >
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            </div>
                            {errors.acceptTerms && (
                                <p className="text-xs text-red-400">{errors.acceptTerms}</p>
                            )}

                            <Button
                                onClick={handleEmailSubmit}
                                disabled={isLoading}
                                className="h-12 rounded-xl bg-white text-black hover:bg-white/90 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <p className="text-center text-sm text-white/40">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline underline-offset-4">
                        Sign in
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
