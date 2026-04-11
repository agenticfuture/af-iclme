"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Maximize2, Minimize2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatbotEmbed } from "@/components/chatbot-embed"

export default function PlaygroundPage() {
    const params = useParams()
    const serviceId = params.id as string
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [iframeKey, setIframeKey] = useState(0)

    const handleReload = () => {
        setIframeKey(prev => prev + 1)
    }

    return (
        <div className={isFullscreen ? "fixed inset-0 bg-background z-50 p-6" : "space-y-6"}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {!isFullscreen && (
                        <Link href={`/dashboard/services/${serviceId}`}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
                        <p className="text-muted-foreground mt-1">
                            Test and interact with your chatbot in real-time
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleReload} title="Reload chatbot">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-4 h-4" />
                        ) : (
                            <Maximize2 className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Tabs for different loading modes */}
            <Tabs defaultValue="iframe" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="iframe">Iframe Mode</TabsTrigger>
                    <TabsTrigger value="script">JS Script Mode</TabsTrigger>
                </TabsList>

                <TabsContent value="iframe" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Chatbot Iframe */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Live Chatbot (Iframe)</CardTitle>
                                    <Badge>Connected</Badge>
                                </div>
                                <CardDescription>
                                    Embedded via iframe from bot.servicegen.local
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChatbotEmbed serviceId={serviceId} mode="iframe" />
                            </CardContent>
                        </Card>

                        {/* Info Panel */}
                        {!isFullscreen && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Testing Tips</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <TestingTips serviceId={serviceId} />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="script" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* JS Script Loader */}
                        <div className="lg:col-span-2">
                            <ChatbotEmbed serviceId={serviceId} mode="script" />
                        </div>

                        {/* Info Panel */}
                        {!isFullscreen && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Script Mode Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">How It Works</h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>Loads chatbot as floating widget</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>Appears in bottom-right corner</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>Can be minimized/maximized</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>Uses bot.servicegen.local/widget.js</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <TestingTips serviceId={serviceId} />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function TestingTips({ serviceId }: { serviceId: string }) {
    return (
        <>
            <div>
                <h4 className="font-medium mb-2">Test Scenarios</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Ask common customer questions</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Test complex multi-turn conversations</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Try edge cases and unexpected inputs</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Verify knowledge base integration</span>
                    </li>
                </ul>
            </div>

            <div>
                <h4 className="font-medium mb-2">Monitor</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Response accuracy and relevance</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Response time and latency</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Conversation flow quality</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Error handling behavior</span>
                    </li>
                </ul>
            </div>

            <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/services/${serviceId}/success`}>
                        View All Embed Options
                    </Link>
                </Button>
            </div>
        </>
    )
}
