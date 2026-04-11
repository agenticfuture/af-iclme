"use client"

import { useState, useEffect } from "react"
import { Code2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChatbotEmbedProps {
    serviceId: string
    mode?: "iframe" | "script"
}

export function ChatbotEmbed({ serviceId, mode = "iframe" }: ChatbotEmbedProps) {
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const chatbotUrl = `https://bot.servicegen.local/iframe/${serviceId}`
    const scriptUrl = `https://bot.servicegen.local/widget.js`

    const loadChatbotScript = () => {
        setIsLoading(true)

        // Remove existing script if any
        const existingScript = document.getElementById('servicegen-chatbot-script')
        if (existingScript) {
            existingScript.remove()
        }

        // Remove existing widget container
        const existingWidget = document.getElementById('servicegen-chatbot-widget')
        if (existingWidget) {
            existingWidget.remove()
        }

        // Create widget container
        const widgetContainer = document.createElement('div')
        widgetContainer.id = 'servicegen-chatbot-widget'
        document.body.appendChild(widgetContainer)

            // Set configuration
            ; (window as any).servicegenConfig = {
                serviceId: serviceId,
                apiUrl: 'https://api.servicegen.local',
                theme: 'light',
                position: 'bottom-right',
                primaryColor: '#6366f1'
            }

        // Load script
        const script = document.createElement('script')
        script.id = 'servicegen-chatbot-script'
        script.src = scriptUrl
        script.async = true
        script.onload = () => {
            setScriptLoaded(true)
            setIsLoading(false)
        }
        script.onerror = () => {
            setIsLoading(false)
            console.error('Failed to load chatbot script')
        }

        document.body.appendChild(script)
    }

    const unloadChatbot = () => {
        // Remove script
        const script = document.getElementById('servicegen-chatbot-script')
        if (script) {
            script.remove()
        }

        // Remove widget
        const widget = document.getElementById('servicegen-chatbot-widget')
        if (widget) {
            widget.remove()
        }

        // Clear config
        if ((window as any).servicegenConfig) {
            delete (window as any).servicegenConfig
        }

        setScriptLoaded(false)
    }

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            unloadChatbot()
        }
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Load Chatbot
                </CardTitle>
                <CardDescription>
                    {mode === "script"
                        ? "Click to load the chatbot via JavaScript (appears bottom-right)"
                        : "View chatbot in embedded iframe"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {mode === "script" ? (
                    <>
                        {!scriptLoaded ? (
                            <Button
                                onClick={loadChatbotScript}
                                disabled={isLoading}
                                className="w-full gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Loading Chatbot...
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink className="w-4 h-4" />
                                        Load Chatbot Widget
                                    </>
                                )}
                            </Button>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-sm text-green-700 dark:text-green-400">
                                        Chatbot loaded - Check bottom-right corner
                                    </span>
                                </div>
                                <Button
                                    onClick={unloadChatbot}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Unload Chatbot
                                </Button>
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Embed Code:</p>
                            <pre className="p-3 bg-muted rounded-md text-xs overflow-x-auto">
                                <code>{`<!-- ServiceGen Chatbot -->
<div id="servicegen-chatbot-widget"></div>
<script>
  window.servicegenConfig = {
    serviceId: "${serviceId}",
    apiUrl: "https://api.servicegen.local",
    theme: "light",
    position: "bottom-right",
    primaryColor: "#6366f1"
  };
  
  (function() {
    var s = document.createElement('script');
    s.src = '${scriptUrl}';
    s.async = true;
    document.body.appendChild(s);
  })();
</script>`}</code>
                            </pre>
                        </div>
                    </>
                ) : (
                    <div className="bg-muted rounded-lg overflow-hidden" style={{ height: '600px' }}>
                        <iframe
                            src={chatbotUrl}
                            className="w-full h-full border-0"
                            title="Chatbot Preview"
                            allow="microphone; camera"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
