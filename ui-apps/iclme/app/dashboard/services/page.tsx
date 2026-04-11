"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Grid, List, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    description: 'Intelligent sales assistant for lead qualification and product recommendations',
    department: 'Sales',
    channels: [{ type: 'web' }],
    data_sources: [{ type: 'file' }],
    status: 'active'
  },
  {
    id: 'mock-service-3',
    service_name: 'HR Onboarding Bot',
    description: 'Automated HR assistant for employee onboarding and policy questions',
    department: 'Human Resources',
    channels: [{ type: 'slack' }, { type: 'msteams' }],
    data_sources: [{ type: 'url' }],
    status: 'active'
  }
]

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredServices = mockServices.filter(service =>
    service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your AI services
          </p>
        </div>
        <Link href="/dashboard/services/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Service
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid/List */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">No services found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or create a new service
              </p>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <ServiceListItem key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}

function ServiceCard({ service }: { service: typeof mockServices[0] }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{service.service_name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {service.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
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
              View Details
            </Button>
          </Link>
          <Link href={`/dashboard/services/${service.id}/playground`}>
            <Button className="gap-2">
              <Play className="w-4 h-4" />
              Playground
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function ServiceListItem({ service }: { service: typeof mockServices[0] }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{service.service_name}</h3>
              <Badge variant="secondary">{service.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {service.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{service.department}</span>
              <span>•</span>
              <span>{service.channels.length} channels</span>
              <span>•</span>
              <span>{service.data_sources.length} data sources</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/dashboard/services/${service.id}`}>
              <Button variant="outline">
                View Details
              </Button>
            </Link>
            <Link href={`/dashboard/services/${service.id}/playground`}>
              <Button className="gap-2">
                <Play className="w-4 h-4" />
                Playground
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}