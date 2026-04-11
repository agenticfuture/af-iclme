"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, Copy, ExternalLink, Code2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DeploymentSuccessPage() {
    const params = useParams()
    const router = useRouter()
    const [copied, setCopied] = useState(false)

    const serviceId = params.id as string

    const embedCode = `<!-- ServiceGen Chatbot -->
<div id="servicegen-widget"></div>
<script>
  (function() {
    window.serviceGenConfig = {
      serviceId: "${serviceId}",
      apiUrl: "https://api.servicegen.local",
      theme: "light", // or "dark"
      position: "bottom-right",
      primaryColor: "#6366f1"
    };
    
    var script = document.createElement('script');
    script.src = 'https://cdn.servicegen.io/widget.js';
    script.async = true;
    document.body.appendChild(script);
  })();
</script>`

    const iframeCode = `<iframe
  src="https://chat.servicegen.local/embed/${serviceId}"
  width="100%"
  height="600px"
  frameborder="0"
  allow="microphone; camera"
  style="border-radius: 12px;"
></iframe>`

    const reactCode = `import { ServiceGenWidget } from '@servicegen/react';

function App() {
  return (
    <ServiceGenWidget
      serviceId="${serviceId}"
      apiUrl="https://api.servicegen.local"
      theme="light"
      position="bottom-right"
    />
  );
}`

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto z-10 space-y-8 pt-12">
                {/* Success Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Your Service is Live!
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Your AI chatbot has been successfully deployed and is ready to handle conversations
                    </p>
                </div>

                {/* Embed Code */}
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Code2 className="w-5 h-5" />
                            Embed Your Chatbot
                        </CardTitle>
                        <CardDescription className="text-white/60">
                            Choose your preferred integration method and copy the code
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="widget" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-white/10">
                                <TabsTrigger value="widget">Widget</TabsTrigger>
                                <TabsTrigger value="iframe">Iframe</TabsTrigger>
                                <TabsTrigger value="react">React</TabsTrigger>
                            </TabsList>

                            <TabsContent value="widget" className="space-y-4">
                                <div className="bg-slate-950/50 rounded-lg p-4 relative">
                                    <pre className="text-sm overflow-x-auto">
                                        <code className="text-green-400">{embedCode}</code>
                                    </pre>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute top-2 right-2 border-white/20 hover:bg-white/10"
                                        onClick={() => handleCopy(embedCode)}
                                    >
                                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? "Copied!" : "Copy"}
                                    </Button>
                                </div>
                                <p className="text-sm text-white/60">
                                    Paste this code before the closing <code className="bg-white/10 px-1 rounded">&lt;/body&gt;</code> tag on your website
                                </p>
                            </TabsContent>

                            <TabsContent value="iframe" className="space-y-4">
                                <div className="bg-slate-950/50 rounded-lg p-4 relative">
                                    <pre className="text-sm overflow-x-auto">
                                        <code className="text-green-400">{iframeCode}</code>
                                    </pre>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute top-2 right-2 border-white/20 hover:bg-white/10"
                                        onClick={() => handleCopy(iframeCode)}
                                    >
                                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? "Copied!" : "Copy"}
                                    </Button>
                                </div>
                                <p className="text-sm text-white/60">
                                    Embed the chatbot as an iframe anywhere on your page
                                </p>
                            </TabsContent>

                            <TabsContent value="react" className="space-y-4">
                                <div className="bg-slate-950/50 rounded-lg p-4 relative">
                                    <pre className="text-sm overflow-x-auto">
                                        <code className="text-green-400">{reactCode}</code>
                                    </pre>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute top-2 right-2 border-white/20 hover:bg-white/10"
                                        onClick={() => handleCopy(reactCode)}
                                    >
                                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? "Copied!" : "Copy"}
                                    </Button>
                                </div>
                                <p className="text-sm text-white/60">
                                    Install: <code className="bg-white/10 px-1 rounded">npm install @servicegen/react</code>
                                </p>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Preview */}
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Live Preview</CardTitle>
                        <CardDescription className="text-white/60">
                            Test your chatbot in action
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-slate-950/50 rounded-lg p-2 h-[400px] flex items-center justify-center">
                            <iframe
                                src={`https://chat.servicegen.local/embed/${serviceId}`}
                                className="w-full h-full rounded-lg border border-white/10"
                                title="Chatbot Preview"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={() => router.push(`/dashboard/services/${serviceId}`)}
                        className="flex-1 h-12 bg-white text-black hover:bg-white/90 font-semibold"
                    >
                        Go to Service Dashboard
                    </Button>
                    <Button
                        onClick={() => router.push(`/dashboard/services/${serviceId}/playground`)}
                        variant="outline"
                        className="flex-1 h-12 border-white/20 hover:bg-white/5"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Playground
                    </Button>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <Link href="#" className="text-sm text-indigo-400 hover:text-indigo-300">
                        View integration documentation →
                    </Link>
                </div>
            </div>
        </div>
    )
}
