"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  // Direct Keycloak authentication
  const handleSignIn = () => {
    const keycloakUrl = "https://auth.servicegen.local/realms/servicegen-saas/protocol/openid-connect/auth?client_id=saas-servicegen&redirect_uri=https://saas.servicegen.local/dashboard&response_type=code&scope=openid"
    window.location.href = keycloakUrl
  }

  const handleSignUp = () => {
    const keycloakUrl = "https://auth.servicegen.local/realms/servicegen-saas/protocol/openid-connect/auth?client_id=saas-servicegen&redirect_uri=https://saas.servicegen.local/dashboard&response_type=code&scope=openid&kc_action=register"
    window.location.href = keycloakUrl
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
            <span className="text-xl font-bold">ServiceGen</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignIn}
              className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="px-4 py-2 bg-white text-black hover:bg-white/90 rounded-md font-medium transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Enterprise-Grade AI Platform</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            AI-Powered Service
            <br />
            Generation Platform
          </h1>

          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-10">
            Build, deploy, and scale intelligent services with enterprise-grade authentication and AI capabilities
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleSignUp}
              className="bg-white text-black hover:bg-white/90 h-12 px-8 text-lg font-semibold rounded-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Free Trial
            </button>
            <button
              className="border border-white/20 hover:bg-white/5 h-12 px-8 text-lg rounded-md transition-colors"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              Watch Demo
            </button>
          </div>

          <p className="text-xs text-white/40 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-white/60">Deploy services in minutes with our streamlined workflow and intelligent automation</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
            <p className="text-white/60">Built-in authentication with industry-standard security protocols</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Scale with Confidence</h3>
            <p className="text-white/60">From prototype to production, our platform grows with your needs</p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/40 text-sm mb-8">Trusted by innovative teams worldwide</p>
          <div className="flex items-center justify-center gap-12 opacity-40 grayscale">
            <div className="text-2xl font-bold">Company A</div>
            <div className="text-2xl font-bold">Company B</div>
            <div className="text-2xl font-bold">Company C</div>
          </div>
        </div>
      </div>
    </div>
  )
}
