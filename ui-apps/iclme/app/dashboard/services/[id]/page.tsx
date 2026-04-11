import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Play, Settings } from "lucide-react"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getService(serviceId: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_GEN_BASE_API}/v1/services/${serviceId}`, {
            next: { revalidate: 0 }
        })
        if (!response.ok) return null
        return await response.json()
    } catch (error) {
        console.error("Failed to fetch service:", error)
        return null
    }
}

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const service = await getService(params.id)

    if (!service) {
        redirect("/dashboard/services")
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/services">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">{service.service_name}</h1>
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">{service.department}</p>
                </div>
                <Link href={`/dashboard/services/${params.id}/playground`}>
                    <Button className="gap-2">
                        <Play className="h-4 w-4" />
                        Playground
                    </Button>
                </Link>
                <Link href={`/dashboard/services/${params.id}/settings`}>
                    <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {/* Service Details */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>About This Service</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                            <p className="text-sm">{service.description || "No description provided"}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Bot Name</h4>
                            <p className="text-sm font-medium">{service.bot_name}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">System Prompt</h4>
                            <p className="text-sm text-muted-foreground line-clamp-3 italic">
                                {service.prompt || "No system prompt configured"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Channels</h4>
                            <div className="flex flex-wrap gap-2">
                                {service.channels?.map((channel: any, idx: number) => (
                                    <Badge key={idx} variant="outline">{channel.type}</Badge>
                                )) || <p className="text-sm text-muted-foreground">No channels configured</p>}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Data Sources</h4>
                            <div className="flex flex-wrap gap-2">
                                {service.data_sources?.map((source: any, idx: number) => (
                                    <Badge key={idx} variant="outline">{source.type}</Badge>
                                )) || <p className="text-sm text-muted-foreground">No data sources configured</p>}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Assigned Agents</h4>
                            <p className="text-sm">{service.agent_ids?.length || 0} agents</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Embed Code */}
            <Card>
                <CardHeader>
                    <CardTitle>Embed Code</CardTitle>
                    <CardDescription>Use this code to embed the chatbot on your website</CardDescription>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                        <code>{`<!-- ServiceGen Chatbot -->
<script>
  window.serviceGenConfig = {
    serviceId: "${service.id}",
    apiUrl: "${process.env.NEXT_PUBLIC_SERVICE_GEN_BASE_API}"
  };
</script>
<script src="https://cdn.servicegen.io/widget.js"></script>`}</code>
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}
