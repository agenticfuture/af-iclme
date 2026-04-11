"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Trash2, Edit2, Plus, FileText, Bot, Database, MessageSquare, UserCheck, Upload, AlertCircle, XCircle, CheckCircle2 } from "lucide-react"

import { ROUTES } from "@/shared/routes";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type DataSourceType = "file" | "url" | "aws_s3"
type ChannelType = "slack" | "msteams" | "web" | "email" | "telephone" | "sms"

interface ChannelConfig {
  id: string
  type: ChannelType
  config: Record<string, any>
  status: "untested" | "success" | "error"
}

interface DataSourceConfig {
  id: string
  type: DataSourceType
  value: string
  file: File | null
}

interface Agent {
  id: string
  firstName: string
  lastName: string
  email: string
  userId?: string
  password?: string
}

interface FormData {
  id?: string
  serviceName: string
  department: string
  botName: string
  description: string
  prompt: string
  dataSources: DataSourceConfig[]
  channels: ChannelConfig[]
  agentIds: string[]
}

// Mock data for agents
const AGENTS = [
  { value: "alice", label: "Alice Johnson (alice@example.com)" },
  { value: "bob", label: "Bob Smith (bob@example.com)" },
  { value: "charlie", label: "Charlie Brown (charlie@example.com)" },
  { value: "diana", label: "Diana Prince (diana@example.com)" },
]

const CHANNEL_TYPES: { id: ChannelType; label: string; icon: string }[] = [
  { id: "slack", label: "Slack", icon: "💬" },
  { id: "msteams", label: "Microsoft Teams", icon: "👥" },
  { id: "web", label: "Web Widget", icon: "🌐" },
  { id: "email", label: "Email", icon: "✉️" },
  { id: "telephone", label: "Telephone", icon: "📞" },
  { id: "sms", label: "SMS", icon: "📱" },
]

export default function NewServicePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    serviceName: "",
    department: "",
    botName: "",
    description: "",
    prompt: "",
    dataSources: [],
    channels: [],
    agentIds: [],
  })
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [onboardingProgress, setOnboardingProgress] = useState(0)
  const [onboardingStatus, setOnboardingStatus] = useState("")
  const [openAgentSelect, setOpenAgentSelect] = useState(false)

  // Channel Form State
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null)
  const [currentChannelType, setCurrentChannelType] = useState<ChannelType>("slack")
  const [currentChannelConfig, setCurrentChannelConfig] = useState<Record<string, any>>({})
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Data Source Form State
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null)
  const [currentSourceType, setCurrentSourceType] = useState<DataSourceType>("url")
  const [currentSourceValue, setCurrentSourceValue] = useState("")
  const [currentSourceFile, setCurrentSourceFile] = useState<File | null>(null)

  // Agent Management State
  const [agents, setAgents] = useState<Agent[]>(AGENTS.map(a => ({
    id: a.value,
    firstName: a.label.split(' ')[0],
    lastName: a.label.split(' ')[1],
    email: a.label.match(/\((.+)\)/)?.[1] || '',
  })))
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    firstName: "",
    lastName: "",
    email: "",
    userId: "",
    password: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Validation helpers
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s-]+$/.test(name)
  }

  const validateAgentFields = (): boolean => {
    const errors: Record<string, string> = {}

    if (!newAgent.firstName || !validateName(newAgent.firstName)) {
      errors.firstName = "First name must be at least 2 characters and contain only letters"
    }

    if (!newAgent.lastName || !validateName(newAgent.lastName)) {
      errors.lastName = "Last name must be at least 2 characters and contain only letters"
    }

    if (!newAgent.email) {
      errors.email = "Email is required"
    } else if (!validateEmail(newAgent.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!newAgent.userId || newAgent.userId.trim().length < 3) {
      errors.userId = "User ID must be at least 3 characters"
    }

    if (!newAgent.password || newAgent.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const totalSteps = 5

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleFormSubmit = async () => {
    setIsOnboarding(true)
    setOnboardingStatus("Initializing service...")

    try {
      const isUpdate = !!formData.id
      const method = isUpdate ? "PATCH" : "POST"
      const endpoint = isUpdate ? `/api/service/${formData.id}` : "/api/service/onboard/service"

      // Simulate progress for better UX
      for (let i = 1; i <= 4; i++) {
        await new Promise(r => setTimeout(r, 800))
        setOnboardingProgress(i * 25)
        updateOnboardingStatus(i)
      }

      await performSubmission(method, endpoint)
      router.push("/dashboard/services")
    } catch (error) {
      console.error("Submission failed:", error)
      setIsOnboarding(false)
    }
  }

  const updateOnboardingStatus = (step: number) => {
    const statuses = [
      "Provisioning infrastructure...",
      "Configuring AI agents...",
      "Connecting channels...",
      "Finalizing setup..."
    ]
    setOnboardingStatus(statuses[step - 1])
  }

  const performSubmission = async (method: string, endpoint: string) => {
    const url = `${process.env.NEXT_PUBLIC_SERVICE_GEN_BASE_API}${endpoint}`
    return await submitForm(method, url)
  }

  const submitForm = async (method: string, url: string) => {
    const body = new FormData()

    // Append basic fields
    const basicFields = ["serviceName", "department", "botName", "description", "prompt"]
    basicFields.forEach(f => body.append(f, (formData as any)[f]))

    // Handle agentId (if multiple, backend might need adjustment, but for now we follow existing logic)
    const agentId = formData.agentIds.length > 0 ? formData.agentIds[0] : ""
    body.append("agentId", agentId)

    // Map channels to enriched structure before stringifying
    const enrichedChannels = formData.channels.map(channel =>
      mapChannelToPayload(channel)
    )
    body.append("channels_json", JSON.stringify(enrichedChannels))

    // Append sources meta
    const sourcesMeta = formData.dataSources.map(s => ({ id: s.id, type: s.type, value: s.value }))
    body.append("dataSources_json", JSON.stringify(sourcesMeta))

    // Append files
    formData.dataSources.forEach((s, i) => {
      if (s.type === "file" && s.file) {
        body.append(`file_${i}`, s.file)
      }
    })

    const response = await fetch(url, { method, body })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || "Submission failed")
    }
    return response.json()
  }


  //
  const openGoogleAuth = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // const authUrl = `https://accounts.google.com?` +
    //   `client_id=YOUR_CLIENT_ID&` +
    //   `redirect_uri=http://localhost:5000/callback&` +
    //   `response_type=code&` +
    //   `scope=https://www.googleapis.com&` +
    //   `access_type=offline&` +
    //   `prompt=consent`;
    // Rewritten Auth URL Construction
    const authUrl = `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_PARTIAL_BASE}/o/oauth2/v2/auth?` +
      `client_id=${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_SERVICE_GEN_BASE_API + ROUTES.GOOGLE_AUTH_REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_AUTH_SCOPE_BASE)}&` +
      `access_type=offline&` +
      `prompt=consent`;

    const popup = window.open(
      authUrl,
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for the message from the popup (sent by your Python backend)
    window.addEventListener('message', (event) => {
      if (event.origin !== `${process.env.NEXT_PUBLIC_SERVICE_GEN_BASE_API}`) return;
      if (event.data.status === 'success') {
        console.log('Gmail Connected!', event.data.email);
        // Now update your UI to show Gmail is linked
      }
    }, { once: true });
  };

  //


  const mapChannelToPayload = (channel: ChannelConfig) => {
    const { type, config, status } = channel
    const service_id = formData.serviceName.toLowerCase().replace(/\s+/g, '-')

    if (type !== "email") {
      return {
        tenant_id: "default-tenant",
        service_id,
        channel_type: type,
        status: status || "untested",
        channel_config: config
      }
    }

    // Enriched Email Mapping
    return {
      tenant_id: "default-tenant",
      service_id,
      channel_type: "email",
      status: status || "untested",
      channel_config: {
        provider: config.provider || "gmail",
        mailbox: {
          address: config.mailbox_address,
          display_name: config.display_name
        },
        auth: {
          auth_mode: config.auth_mode || "servicegen_managed",
          redirect_uri: config.redirect_uri,
          scopes: config.scopes,
          customer_app: (config.auth_mode === "customer_managed") ? {
            google_oauth: (config.provider === "gmail" || config.provider === "google_workspace") ? {
              client_id: config.google_client_id,
              client_secret: config.google_client_secret,
              project_id: config.google_project_id,
            } : undefined,
            microsoft_oauth: (config.provider === "m365") ? {
              tenant_id: config.microsoft_tenant_id,
              client_id: config.microsoft_client_id,
              client_secret: config.microsoft_client_secret,
            } : undefined,
            imap_smtp: (config.provider === "imap") ? {
              imap_username: config.imap_username || config.mailbox_address,
              imap_password: config.imap_password,
              smtp_username: config.smtp_username,
              smtp_password: config.smtp_password,
            } : undefined
          } : undefined
        },
        ingestion: {
          mode: config.ingestion_mode || "push",
          poll: (config.ingestion_mode === "poll") ? {
            interval_seconds: config.poll_interval_seconds || 60,
            max_per_tick: config.max_per_tick || 5
          } : undefined,
          push: (config.ingestion_mode === "push") ? {
            ...(config.provider === 'gmail' ? { gmail_pubsub: {} } : {}),
            ...(config.provider === 'm365' ? { ms_graph: {} } : {}),
          } : undefined
        },
        routing: {
          mode: config.routing_mode || "auto_reply",
          default_sender_channel_id: config.default_sender_channel_id,
          rules: config.routing_rules
        },
        policies: {
          store_raw_body: config.store_raw_body,
          pii_redaction: config.pii_redaction !== false,
          attachments: {
            mode: config.attachments_mode || "deny",
            max_mb: config.max_attachment_mb
          }
        },
        test: {
          send_test_email_to: config.send_test_email_to
        },
        metadata: {
          tags: config.tags ? (Array.isArray(config.tags) ? config.tags : config.tags.split(",").map((s: string) => s.trim())) : [],
          notes: config.notes
        }
      }
    }
  }

  // Channel Logic
  const handleAddChannel = async () => {
    // 1. Perform automated server-side test
    setIsTestingConnection(true)
    setConnectionStatus(null)

    const payload = mapChannelToPayload({
      id: "temp",
      type: currentChannelType,
      config: currentChannelConfig,
      status: "untested"
    })
    console.log("Testing channel with payload:", JSON.stringify(payload, null, 2))

    try {
      // Mock POST request
      await new Promise(resolve => setTimeout(resolve, 2000))

      const isSuccess = Math.random() > 0.15 // 85% success rate for mock

      if (!isSuccess) {
        setConnectionStatus({
          type: "error",
          message: "Server-side validation failed. Please check your configuration."
        })
        setIsTestingConnection(false)
        return // Block adding if test fails
      }

      // 2. If test passes, add/update the channel
      const newChannel: ChannelConfig = {
        id: editingChannelId || Math.random().toString(36).substr(2, 9),
        type: currentChannelType,
        config: currentChannelConfig,
        status: "success"
      }

      if (editingChannelId) {
        setFormData(prev => ({
          ...prev,
          channels: prev.channels.map(c => c.id === editingChannelId ? newChannel : c)
        }))
        setEditingChannelId(null)
      } else {
        setFormData(prev => ({
          ...prev,
          channels: [...prev.channels, newChannel]
        }))
      }

      // Reset form
      setCurrentChannelConfig({})
      setConnectionStatus(null)
    } catch (err) {
      setConnectionStatus({
        type: "error",
        message: "Network error occurred during connection test."
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleEditChannel = (channel: ChannelConfig) => {
    setEditingChannelId(channel.id)
    setCurrentChannelType(channel.type)
    setCurrentChannelConfig(channel.config)
    setConnectionStatus(channel.status === "untested" ? null : {
      type: channel.status as "success" | "error",
      message: channel.status === "success" ? "Previously tested successfully" : "Previous test failed"
    })
  }

  const handleCancelChannelEdit = () => {
    setEditingChannelId(null)
    setCurrentChannelConfig({})
    setConnectionStatus(null)
  }

  const handleRemoveChannel = (id: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.filter(c => c.id !== id)
    }))
  }

  // Data Source Logic
  const handleAddSource = () => {
    const newSource: DataSourceConfig = {
      id: editingSourceId || Math.random().toString(36).substr(2, 9),
      type: currentSourceType,
      value: currentSourceValue,
      file: currentSourceFile,
    }

    setFormData(prev => ({
      ...prev,
      dataSources: editingSourceId
        ? prev.dataSources.map(s => s.id === editingSourceId ? newSource : s)
        : [...prev.dataSources, newSource]
    }))

    setEditingSourceId(null)
    setCurrentSourceValue("")
    setCurrentSourceFile(null)
  }

  const handleEditSource = (source: DataSourceConfig) => {
    setEditingSourceId(source.id)
    setCurrentSourceType(source.type)
    setCurrentSourceValue(source.value)
    setCurrentSourceFile(source.file)
  }

  const handleCancelSourceEdit = () => {
    setEditingSourceId(null)
    setCurrentSourceType("file")
    setCurrentSourceValue("")
    setCurrentSourceFile(null)
  }

  const handleRemoveSource = (id: string) => {
    setFormData(prev => ({
      ...prev,
      dataSources: prev.dataSources.filter(s => s.id !== id)
    }))
  }

  const renderChannelConfigInputs = () => {
    switch (currentChannelType) {
      case "slack":
      case "msteams":
        return (
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              placeholder="https://hooks.slack.com/services/..."
              value={currentChannelConfig.webhookUrl || ""}
              onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, webhookUrl: e.target.value })}
            />
          </div>
        )
      case "web":
        return (
          <div className="space-y-2">
            <Label>Allowed Domains</Label>
            <Input
              placeholder="example.com, myapp.com"
              value={currentChannelConfig.domains || ""}
              onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, domains: e.target.value })}
            />
          </div>
        )
      case "email":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Provider & Mailbox */}
            <div className="space-y-4 p-4 border rounded-xl bg-muted/5">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</div>
                <h4 className="text-sm font-semibold">Provider & Mailbox</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Provider</Label>
                  <Select
                    value={currentChannelConfig.provider || "gmail"}
                    onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, provider: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmail">Gmail (personal/consumer)</SelectItem>
                      <SelectItem value="google_workspace">Google Workspace (professional)</SelectItem>
                      <SelectItem value="m365">Microsoft 365 / Outlook.com</SelectItem>
                      <SelectItem value="imap">Generic IMAP/SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mailbox address</Label>
                  <Input
                    type="email"
                    placeholder="support@company.com"
                    value={currentChannelConfig.mailbox_address || ""}
                    onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, mailbox_address: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Display name (optional)</Label>
                <Input
                  placeholder="Support Team"
                  value={currentChannelConfig.display_name || ""}
                  onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, display_name: e.target.value })}
                />
              </div>
            </div>

            {/* 2. Authentication & Routing */}
            <div className="space-y-4 p-4 border rounded-xl bg-muted/5">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</div>
                <h4 className="text-sm font-semibold">Authentication & Routing</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Auth Mode</Label>
                  <Select
                    value={currentChannelConfig.auth_mode || "servicegen_managed"}
                    onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, auth_mode: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select auth mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="servicegen_managed">ServiceGen Managed (Recommended)</SelectItem>
                      <SelectItem value="customer_managed">Customer Managed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Routing Mode</Label>
                  <Select
                    value={currentChannelConfig.routing_mode || "auto_reply"}
                    onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, routing_mode: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto_reply">Auto-reply</SelectItem>
                      <SelectItem value="ticketing">Ticketing</SelectItem>
                      <SelectItem value="agent_assist">Agent assist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {currentChannelConfig.routing_mode !== "auto_reply" && (
                <div className="space-y-2">
                  <Label>Default Sender Channel ID (optional)</Label>
                  <Input
                    placeholder="channel_id_123"
                    value={currentChannelConfig.default_sender_channel_id || ""}
                    onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, default_sender_channel_id: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* 3. Ingestion & Policies */}
            <div className="space-y-4 p-4 border rounded-xl bg-muted/5">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</div>
                <h4 className="text-sm font-semibold">Ingestion & Policies</h4>
              </div>
              <div className="space-y-2">
                <Label>Ingestion Mode</Label>
                <Select
                  value={currentChannelConfig.ingestion_mode || "push"}
                  onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, ingestion_mode: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Push (real-time)</SelectItem>
                    <SelectItem value="poll">Poll (periodic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentChannelConfig.ingestion_mode === "poll" && (
                <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg bg-orange-500/5">
                  <div className="space-y-2">
                    <Label className="text-xs">Interval (sec)</Label>
                    <Input
                      type="number"
                      min={30}
                      value={currentChannelConfig.poll_interval_seconds || 60}
                      onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, poll_interval_seconds: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Max Per Tick</Label>
                    <Input
                      type="number"
                      min={1}
                      value={currentChannelConfig.max_per_tick || 5}
                      onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, max_per_tick: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="text-xs">PII Redaction</Label>
                  <Switch
                    checked={currentChannelConfig.pii_redaction !== false}
                    onCheckedChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, pii_redaction: val })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="text-xs">Store Raw Body</Label>
                  <Switch
                    checked={currentChannelConfig.store_raw_body === true}
                    onCheckedChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, store_raw_body: val })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <Select
                    value={currentChannelConfig.attachments_mode || "deny"}
                    onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, attachments_mode: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deny">Deny</SelectItem>
                      <SelectItem value="metadata_only">Metadata Only</SelectItem>
                      <SelectItem value="allow">Allow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(currentChannelConfig.attachments_mode === "metadata_only" || currentChannelConfig.attachments_mode === "allow") && (
                  <div className="space-y-2">
                    <Label>Max Size (MB)</Label>
                    <Input
                      type="number"
                      value={currentChannelConfig.max_attachment_mb || 10}
                      onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, max_attachment_mb: parseInt(e.target.value) })}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 4. Connection Details */}
            <div className="space-y-4 p-4 border rounded-xl bg-muted/5">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">4</div>
                <h4 className="text-sm font-semibold">Connection Details</h4>
              </div>

              {currentChannelConfig.auth_mode === "customer_managed" ? (
                <div className="space-y-4">
                  {(currentChannelConfig.provider === "gmail" || currentChannelConfig.provider === "google_workspace") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Client ID</Label>
                        <Input
                          type="password"
                          value={currentChannelConfig.google_client_id || ""}
                          onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, google_client_id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Client Secret</Label>
                        <Input
                          type="password"
                          value={currentChannelConfig.google_client_secret || ""}
                          onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, google_client_secret: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  {currentChannelConfig.provider === "m365" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-full">
                        <Label>Tenant ID</Label>
                        <Input
                          value={currentChannelConfig.microsoft_tenant_id || ""}
                          onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, microsoft_tenant_id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Client ID</Label>
                        <Input
                          type="password"
                          value={currentChannelConfig.microsoft_client_id || ""}
                          onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, microsoft_client_id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Client Secret</Label>
                        <Input
                          type="password"
                          value={currentChannelConfig.microsoft_client_secret || ""}
                          onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, microsoft_client_secret: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  {currentChannelConfig.provider === "imap" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>IMAP Host</Label>
                          <Input value={currentChannelConfig.imap_host || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, imap_host: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>IMAP Port</Label>
                          <Input type="number" value={currentChannelConfig.imap_port || 993} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, imap_port: parseInt(e.target.value) })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>SMTP Host</Label>
                          <Input value={currentChannelConfig.smtp_host || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, smtp_host: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>SMTP Port</Label>
                          <Input type="number" value={currentChannelConfig.smtp_port || 587} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, smtp_port: parseInt(e.target.value) })} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">ServiceGen handles core connection for managed auth. Optional settings below.</p>
              )}

              <div className="space-y-2">
                <Label>Redirect URI (optional)</Label>
                <Input
                  value={currentChannelConfig.redirect_uri || ""}
                  onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, redirect_uri: e.target.value })}
                />
              </div>
            </div>

            {/* 5. Review & Meta */}
            <div className="space-y-4 p-4 border rounded-xl bg-muted/5">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">5</div>
                <h4 className="text-sm font-semibold">Review & Meta</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Test Email Output</Label>
                  <Input
                    placeholder="send test to..."
                    value={currentChannelConfig.send_test_email_to || ""}
                    onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, send_test_email_to: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="tag1, tag2"
                    value={currentChannelConfig.tags || ""}
                    onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, tags: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="..."
                    value={currentChannelConfig.notes || ""}
                    onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      case "telephone":
      case "sms":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{currentChannelType === "telephone" ? "Phone Number" : "Mobile Number"}</Label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={currentChannelConfig.phoneNumber || ""}
                onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, phoneNumber: e.target.value })}
              />
            </div>
            {currentChannelType === "sms" && (
              <div className="space-y-2">
                <Label>SMS Provider (optional)</Label>
                <Select
                  value={currentChannelConfig.provider || "twilio"}
                  onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, provider: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="messagebird">MessageBird</SelectItem>
                    <SelectItem value="aws_sns">AWS SNS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const renderServiceDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Service Details</h2>
        <p className="text-sm text-muted-foreground">Basic information to identify this service.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="serviceName">Service Name</Label>
        <Input
          id="serviceName"
          placeholder="e.g. HR Benefits Support"
          value={formData.serviceName}
          onChange={(e) => handleChange("serviceName", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          placeholder="e.g. Human Resources"
          value={formData.department}
          onChange={(e) => handleChange("department", e.target.value)}
          required
        />
      </div>
    </div>
  )

  const renderBotConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Bot Configuration</h2>
        <p className="text-sm text-muted-foreground">Define the personality and instructions.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="botName">Bot Name</Label>
        <Input
          id="botName"
          placeholder="e.g. BenefitsBot"
          value={formData.botName}
          onChange={(e) => handleChange("botName", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Internal bot for answering questions..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prompt">System Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="You are a helpful HR assistant..."
          value={formData.prompt}
          onChange={(e) => handleChange("prompt", e.target.value)}
          rows={6}
          required
        />
        <p className="text-xs text-muted-foreground">
          This prompt defines the core behavior and constraints of your bot.
        </p>
      </div>
    </div>
  )

  const renderDataSources = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Data & Policy Ingestion</h2>
        <p className="text-sm text-muted-foreground">
          Connect your knowledge base. The bot will use this data to answer questions.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Data Source Type</Label>
        <Select
          value={currentSourceType}
          onValueChange={(val: DataSourceType) => setCurrentSourceType(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="url">URL / Website</SelectItem>
            <SelectItem value="file">File Upload (PDF, DOCX, TXT)</SelectItem>
            <SelectItem value="aws_s3">AWS S3 Bucket</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {currentSourceType === "url" && (
        <div className="space-y-2">
          <Label htmlFor="url-source">Document URLs</Label>
          <Textarea
            id="url-source"
            placeholder="https://example.com/policy, https://intranet.company.com/docs"
            value={currentSourceValue}
            onChange={(e) => setCurrentSourceValue(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Separate multiple URLs with commas.
          </p>
        </div>
      )}

      {currentSourceType === "file" && (
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Document</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setCurrentSourceFile(file)
            }}
            className="cursor-pointer"
          />
          {currentSourceFile && (
            <p className="text-sm text-green-600">
              Selected: {currentSourceFile.name}
            </p>
          )}
        </div>
      )}

      {currentSourceType === "aws_s3" && (
        <div className="space-y-2">
          <Label htmlFor="s3-source">S3 Bucket URL</Label>
          <Input
            id="s3-source"
            placeholder="s3://my-company-docs/policies/"
            value={currentSourceValue}
            onChange={(e) => setCurrentSourceValue(e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-3">
        {editingSourceId && (
          <Button type="button" variant="ghost" onClick={handleCancelSourceEdit} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="button" onClick={handleAddSource} className="flex-1">
          {editingSourceId ? "Update Data Source" : "Add Data Source"}
        </Button>
      </div>

      {formData.dataSources.length > 0 && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.dataSources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium capitalize">{source.type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {source.type === "file" ? source.file?.name : source.value}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" type="button" onClick={() => handleEditSource(source)}>Edit</Button>
                    <Button variant="ghost" size="sm" type="button" onClick={() => handleRemoveSource(source.id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )

  const renderChannels = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Channels</h2>
        <p className="text-sm text-muted-foreground">
          Configure where your bot will be available.
        </p>
      </div>

      {/* Added Channels List */}
      {formData.channels.length > 0 && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Configuration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.channels.map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <span>{CHANNEL_TYPES.find(t => t.id === channel.type)?.icon}</span>
                    {CHANNEL_TYPES.find(t => t.id === channel.type)?.label}
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {channel.type === "email" ? (channel.config.provider || "gmail") : "N/A"}
                  </TableCell>
                  <TableCell>
                    {channel.status === "success" ? (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Passed</span>
                      </div>
                    ) : channel.status === "error" ? (
                      <div className="flex items-center gap-1.5 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Failed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Untested</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {channel.type === "slack" || channel.type === "msteams" ? channel.config.webhookUrl :
                      channel.type === "web" ? channel.config.domains :
                        channel.type === "email" ? channel.config.mailbox_address :
                          channel.type === "telephone" ? channel.config.phoneNumber :
                            "..."}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" type="button" onClick={() => handleEditChannel(channel)}>Edit</Button>
                    <Button variant="ghost" size="sm" type="button" onClick={() => handleRemoveChannel(channel.id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Channel Type</Label>
          <Select
            value={currentChannelType}
            onValueChange={(val: ChannelType) => {
              setCurrentChannelType(val)
              setCurrentChannelConfig({}) // Reset config when type changes
              setConnectionStatus(null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a channel type" />
            </SelectTrigger>
            <SelectContent>
              {CHANNEL_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <span className="flex items-center gap-2">
                    {type.icon} {type.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {renderChannelConfigInputs()}

        {connectionStatus && (
          <div className={cn(
            "p-3 rounded-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2",
            connectionStatus.type === "success" ? "bg-green-500/10 text-green-600 border border-green-200" : "bg-red-500/10 text-red-600 border border-red-200"
          )}>
            {connectionStatus.type === "success" ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full bg-red-600" />}
            {connectionStatus.message}
          </div>
        )}

        <div className="flex justify-end gap-3">
          {editingChannelId && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancelChannelEdit}
              disabled={isTestingConnection}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handleAddChannel}
            disabled={isTestingConnection}
            className="flex-1"
          >
            {isTestingConnection ? "Testing..." : (editingChannelId ? "Update Channel" : "Add Channel")}
          </Button>
        </div>
      </div>
    </div>
  )

  const generateCredentials = () => {
    // Generate user_id from first and last name
    let userId = ''
    if (newAgent.firstName && newAgent.lastName) {
      userId = `${newAgent.firstName.toLowerCase()}${newAgent.lastName.toLowerCase()}`.replace(/\s+/g, '')
    }

    // Generate password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    const length = 16
    let password = ''
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    setNewAgent({ ...newAgent, userId, password })
  }

  const handleAddAgent = () => {
    if (!newAgent.firstName || !newAgent.lastName || !newAgent.email) {
      return
    }

    const agent: Agent = {
      id: editingAgentId || Math.random().toString(36).substr(2, 9),
      firstName: newAgent.firstName,
      lastName: newAgent.lastName,
      email: newAgent.email,
      userId: newAgent.userId,
      password: newAgent.password,
    }

    if (editingAgentId) {
      setAgents(agents.map(a => a.id === editingAgentId ? agent : a))
      setEditingAgentId(null)
    } else {
      setAgents([...agents, agent])
      setFormData(prev => ({
        ...prev,
        agentIds: [...prev.agentIds, agent.id]
      }))
    }

    setNewAgent({ firstName: "", lastName: "", email: "", userId: "", password: "" })
  }

  const handleEditAgent = (agent: Agent) => {
    setEditingAgentId(agent.id)
    setNewAgent({
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      userId: agent.userId || "",
      password: agent.password || "",
    })
  }

  const handleCancelAgentEdit = () => {
    setEditingAgentId(null)
    setNewAgent({ firstName: "", lastName: "", email: "", userId: "", password: "" })
  }

  const handleRemoveAgent = (agentId: string) => {
    setFormData(prev => ({
      ...prev,
      agentIds: prev.agentIds.filter(id => id !== agentId)
    }))
  }

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) return

      const lines = text.split("\n")
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase())

      const newAgents: Agent[] = []
      const newAgentIds: string[] = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = line.split(",").map(v => v.trim())
        if (values.length < headers.length) continue

        const agentData: Partial<Agent> = {}
        headers.forEach((header, index) => {
          if (header === 'firstname') agentData.firstName = values[index]
          if (header === 'lastname') agentData.lastName = values[index]
          if (header === 'email') agentData.email = values[index]
          if (header === 'userid') agentData.userId = values[index]
          if (header === 'password') agentData.password = values[index]
        })

        if (agentData.firstName && agentData.lastName && agentData.email) {
          const id = Math.random().toString(36).substr(2, 9)
          const agent: Agent = {
            id,
            firstName: agentData.firstName,
            lastName: agentData.lastName,
            email: agentData.email,
            userId: agentData.userId || `${agentData.firstName.toLowerCase()}${agentData.lastName.toLowerCase()}`.replace(/\s+/g, ''),
            password: agentData.password || generateCredentialsFromValues(agentData.firstName, agentData.lastName).password
          }
          newAgents.push(agent)
          newAgentIds.push(id)
        }
      }

      if (newAgents.length > 0) {
        setAgents(prev => [...prev, ...newAgents])
        setFormData(prev => ({
          ...prev,
          agentIds: [...prev.agentIds, ...newAgentIds]
        }))
      }
    }
    reader.readAsText(file)
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const generateCredentialsFromValues = (firstName: string, lastName: string) => {
    const userId = `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(/\s+/g, '')
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    const length = 16
    let password = ''
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return { userId, password }
  }

  const renderAgentAssignment = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Agent Assignment</h2>
        <p className="text-sm text-muted-foreground">
          Assign one or more human agents to oversee or assist this service.
        </p>
      </div>

      {/* Added Agents List */}
      {formData.agentIds.length > 0 && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Password</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.agentIds.map((agentId) => {
                const agent = agents.find(a => a.id === agentId)
                if (!agent) return null
                return (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      {agent.firstName} {agent.lastName}
                    </TableCell>
                    <TableCell className="text-sm">
                      {agent.email}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {agent.userId || "-"}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {agent.password ? "••••••••" : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" type="button" onClick={() => handleEditAgent(agent)}>Edit</Button>
                      <Button variant="ghost" size="sm" type="button" onClick={() => handleRemoveAgent(agent.id)}>Remove</Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Agent Form */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{editingAgentId ? "Edit Agent" : "Add New Agent"}</h3>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCSVImport}
              accept=".csv"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          </div>
        </div>

        {!editingAgentId && (
          <p className="text-[10px] text-muted-foreground">
            CSV Format: <code className="bg-muted px-1 rounded">firstName, lastName, email, [userId], [password]</code>
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              placeholder="John"
              value={newAgent.firstName || ""}
              onChange={(e) => setNewAgent({ ...newAgent, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              placeholder="Doe"
              value={newAgent.lastName || ""}
              onChange={(e) => setNewAgent({ ...newAgent, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="john.doe@company.com"
            value={newAgent.email || ""}
            onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>User ID</Label>
          <Input
            placeholder="Auto-generated from name"
            value={newAgent.userId || ""}
            onChange={(e) => setNewAgent({ ...newAgent, userId: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Password / Credentials</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Click Generate to create credentials"
              value={newAgent.password || ""}
              onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateCredentials}
              disabled={!newAgent.firstName || !newAgent.lastName}
            >
              Generate
            </Button>
          </div>
          {(!newAgent.firstName || !newAgent.lastName) && (
            <p className="text-xs text-muted-foreground">Enter first and last name to generate credentials</p>
          )}
        </div>

        <div className="flex gap-3">
          {editingAgentId && (
            <Button type="button" variant="ghost" onClick={handleCancelAgentEdit} className="flex-1">
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handleAddAgent}
            className="flex-1"
            disabled={!newAgent.firstName || !newAgent.lastName || !newAgent.email || !newAgent.userId || !newAgent.password}
          >
            {editingAgentId ? "Update Agent" : "Add Agent"}
          </Button>
        </div>
      </div>
    </div>
  )

  const renderOnboardingProgress = () => (
    <Dialog open={isOnboarding} onOpenChange={setIsOnboarding}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setting up your service...</DialogTitle>
          <DialogDescription>
            Please wait while we configure your new AI service. This may take a moment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Progress value={onboardingProgress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">{onboardingStatus}</p>
        </div>
      </DialogContent>
    </Dialog>
  )

  const ONBOARDING_STEPS = [
    { id: 1, label: "Service Details", icon: FileText, description: "Basic information" },
    { id: 2, label: "Bot Configuration", icon: Bot, description: "AI personality & prompts" },
    { id: 3, label: "Data Sources", icon: Database, description: "Knowledge base" },
    { id: 4, label: "Channels", icon: MessageSquare, description: "Communication channels" },
    { id: 5, label: "Agent Assignment", icon: UserCheck, description: "Human oversight" },
  ]

  return (
    <div className="container py-8 max-w-6xl">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Create a new service</h1>
        <p className="text-muted-foreground">
          Configure your AI service in just a few steps.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <Card className="p-4 sticky top-4">
            <div className="space-y-1">
              {ONBOARDING_STEPS.map((stepItem, index) => {
                const Icon = stepItem.icon
                const isActive = step === stepItem.id
                const isCompleted = step > stepItem.id

                return (
                  <button
                    key={stepItem.id}
                    type="button"
                    onClick={() => setStep(stepItem.id)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all",
                      isActive && "bg-primary text-primary-foreground",
                      !isActive && isCompleted && "bg-muted hover:bg-muted/80",
                      !isActive && !isCompleted && "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      isActive && "bg-primary-foreground text-primary",
                      !isActive && isCompleted && "bg-primary text-primary-foreground",
                      !isActive && !isCompleted && "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {isCompleted ? <Check className="w-4 h-4" /> : stepItem.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "text-sm font-medium",
                        !isActive && "text-foreground"
                      )}>
                        {stepItem.label}
                      </div>
                      <div className={cn(
                        "text-xs mt-0.5",
                        isActive && "text-primary-foreground/80",
                        !isActive && "text-muted-foreground"
                      )}>
                        {stepItem.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span className="font-medium">{Math.round((step / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(step / totalSteps) * 100} className="h-2" />
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <Card className="p-6">
            <form className="space-y-8">
              {step === 1 && renderServiceDetails()}
              {step === 2 && renderBotConfig()}
              {step === 3 && renderDataSources()}
              {step === 4 && renderChannels()}
              {step === 5 && renderAgentAssignment()}

              <div className="flex justify-between pt-4 border-t">
                {step > 1 ? (
                  <Button type="button" variant="ghost" onClick={prevStep}>
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="button" onClick={handleFormSubmit}>
                    {formData.id ? "Update Service" : "Create Service"}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>

      {renderOnboardingProgress()}
    </div>
  )
}