"use client"

import Link from "next/link"
import { Plus, TrendingUp, Users, Zap, Sparkles, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockServices = [
  {
    id: 'mock-service-1',
    service_name: 'Customer Support Bot',
    description: 'AI-powered customer support chatbot for handling common inquiries',
    department: 'Support',
    channels: [{ type: 'web' }, { type: 'slack' }],
    data_sources: [{ type: 'url' }, { type: 'file' }],
    status: 'active'
  },
  {
    id: 'mock-service-2',
    service_name: 'Sales Assistant',
    description: 'Intelligent sales assistant for lead qualification',
    department: 'Sales',
    channels: [{ type: 'web' }],
    data_sources: [{ type: 'file' }],
    status: 'active'
  },
  {
    id: 'mock-service-3',
    service_name: 'HR Onboarding Bot',
    description: 'Automated HR assistant for employee onboarding',
    department: 'Human Resources',
    channels: [{ type: 'slack' }, { type: 'msteams' }],
    data_sources: [{ type: 'url' }],
    status: 'active'
  }
]

export default function DashboardHomePage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your AI services
          </p>
        </div>
        <Link href="/dashboard/services/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Service
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockServices.length}</div>
            <p className="text-xs text-muted-foreground">Active deployments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">-0.3s from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Your Services</h2>
          <Link href="/dashboard/services">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{service.service_name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {service.description}
                    </CardDescription>
                  </div>
                  <Badge className="ml-2 bg-green-500/10 text-green-500">
                    {service.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{service.department}</span>
                  <span>{service.channels.length} channels</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/services/${service.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Details
                    </Button>
                  </Link>
                  <Link href={`/dashboard/services/${service.id}/playground`}>
                    <Button className="gap-2">
                      <Play className="w-4 h-4" />
                      Play
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/services/new">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              Create New Service
            </Button>
          </Link>
          <Link href="/dashboard/users">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
          </Link>
          <Link href="/dashboard/organization/general">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Sparkles className="h-4 w-4" />
              Organization Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
