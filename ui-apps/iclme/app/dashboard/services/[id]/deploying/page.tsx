"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, Rocket } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface DeploymentStage {
    name: string
    status: "pending" | "in-progress" | "completed"
    message: string
}

export default function DeploymentPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [progress, setProgress] = useState(0)
    const [currentStage, setCurrentStage] = useState(0)
    const [stages, setStages] = useState<DeploymentStage[]>([
        { name: "Initializing", status: "pending", message: "Preparing deployment environment..." },
        { name: "Building Service", status: "pending", message: "Compiling service configuration..." },
        { name: "Loading Knowledge", status: "pending", message: "Processing data sources..." },
        { name: "Deploying Channels", status: "pending", message: "Setting up communication channels..." },
        { name: "Testing", status: "pending", message: "Running smoke tests..." },
        { name: "Complete", status: "pending", message: "Deployment successful!" },
    ])

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = Math.min(prev + 2, 100)

                // Update stage based on progress
                const stageIndex = Math.floor((newProgress / 100) * stages.length)
                if (stageIndex !== currentStage && stageIndex < stages.length) {
                    setCurrentStage(stageIndex)

                    setStages((prevStages) =>
                        prevStages.map((stage, idx) => ({
                            ...stage,
                            status: idx < stageIndex ? "completed" : idx === stageIndex ? "in-progress" : "pending"
                        }))
                    )
                }

                if (newProgress === 100) {
                    clearInterval(interval)
                }

                return newProgress
            })
        }, 100)

        return () => clearInterval(interval)
    }, [])

    const isComplete = progress === 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center p-6">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="w-full max-w-2xl z-10 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
                        {isComplete ? (
                            <CheckCircle2 className="w-10 h-10" />
                        ) : (
                            <Rocket className="w-10 h-10 animate-bounce" />
                        )}
                    </div>
                    <h1 className="text-4xl font-bold">
                        {isComplete ? "Deployment Complete!" : "Deploying Your Service"}
                    </h1>
                    <p className="text-white/60">
                        {isComplete
                            ? "Your AI service is now live and ready to use"
                            : "Please wait while we set up your AI service..."}
                    </p>
                </div>

                {/* Progress */}
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Deployment Progress</CardTitle>
                        <CardDescription className="text-white/60">
                            {Math.round(progress)}% complete
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Progress value={progress} className="h-3" />

                        {/* Stages */}
                        <div className="space-y-3">
                            {stages.map((stage, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${stage.status === "in-progress"
                                        ? "bg-indigo-500/20 border border-indigo-500/30"
                                        : stage.status === "completed"
                                            ? "bg-green-500/10"
                                            : "bg-white/5"
                                        }`}
                                >
                                    <div className="flex-shrink-0">
                                        {stage.status === "completed" ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : stage.status === "in-progress" ? (
                                            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{stage.name}</p>
                                        <p className="text-sm text-white/60">{stage.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                {isComplete && (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Button
                            onClick={() => router.push(`/dashboard/services/${params.id}/success`)}
                            className="w-full h-12 bg-white text-black hover:bg-white/90 font-semibold"
                        >
                            View Embed Code
                        </Button>
                        <Button
                            onClick={() => router.push(`/dashboard/services/${params.id}`)}
                            variant="outline"
                            className="w-full h-12 border-white/20 hover:bg-white/5"
                        >
                            Go to Service
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
