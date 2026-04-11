"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Trash2, Edit2, Plus } from "lucide-react"

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
type ChannelType = "slack" | "msteams" | "web" | "email" | "telephone"

interface ChannelConfig {
  id: string
  type: ChannelType
  config: Record<string, string>
}

interface FormData {
  serviceName: string
  department: string
  botName: string
  description: string
  prompt: string
  dataSourceType: DataSourceType
  dataSourceValue: string
  dataSourceFile: File | null
  channels: ChannelConfig[]
  agentId: string
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
    dataSourceType: "url",
    dataSourceValue: "",
    dataSourceFile: null,
    channels: [],
    agentId: "",
  })
  const [openAgentSelect, setOpenAgentSelect] = useState(false)

  // Channel Form State
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null)
  const [currentChannelType, setCurrentChannelType] = useState<ChannelType>("slack")
  const [currentChannelConfig, setCurrentChannelConfig] = useState<Record<string, any>>({})
  const [emailStep, setEmailStep] = useState(1)

  const totalSteps = 5

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleFormSubmit = async () => {
    if (formData.dataSourceType === "file") {
      await handleSubmitWithFile()
    } else {
      await handleSubmit()
    }


  }
  const handleSubmit = async () => {
    // Construct the payload
    //const token = await getAccessToken()

    const payload = {
      serviceName: formData.serviceName,
      department: formData.department,
      botName: formData.botName,
      description: formData.description,
      prompt: formData.prompt,
      dataSourceType: formData.dataSourceType,
      dataSourceValue: formData.dataSourceValue,
      channels: formData.channels,
      agentId: formData.agentId,
      // Handle file separately if needed, for now just sending null for file in JSON
      dataSourceFile: null
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE_GEN_BASE_API}/api/customer/onboard/service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to create service')
      }

      const data = await response.json()
      console.log("Success:", data)

      router.push("/dashboard/services")
    } catch (error) {
      console.error("Error submitting form:", error)
      // Handle error (e.g., show toast notification)
      console.log("error:", error)
    }



  }

  const handleSubmitWithFile = async () => {
    //const token = await getAccessToken()
    const form = new FormData()

    form.append("serviceName", formData.serviceName)
    form.append("department", formData.department)
    form.append("botName", formData.botName)
    form.append("prompt", formData.prompt)
    form.append("agentId", formData.agentId)
    form.append("channels_json", JSON.stringify(formData.channels))
    form.append("dataSourceType", formData.dataSourceType)
    form.append("dataSourceValue", formData.dataSourceValue ?? "")
    form.append("dataSourceFile", formData.dataSourceFile ?? "")

    //if (formData.dataSourceFile) {
    //  form.append("dataSourceFile", formData.dataSourceFile)
    //}

    //console.log(formData)
    //console.log(form)
    form.forEach((value, key) => console.log(key, value))
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE_GEN_BASE_API}/api/customer/onboard/service-with-file`,
        {
          method: "POST",
          headers: {
            // "Authorization": `Bearer ${token}`,
          },
          body: form,
        }
      )

      if (!res.ok) throw new Error("Service creation failed")
      else { console.log(res); }

      router.push("/dashboard/services")

    } catch (error) {
      console.error("Error submitting form:", error)
      // Handle error (e.g., show toast notification)
      console.log("error:", error)
    }


  }


  // Channel Logic
  const handleAddChannel = () => {
    const newChannel: ChannelConfig = {
      id: editingChannelId || Math.random().toString(36).substr(2, 9),
      type: currentChannelType,
      config: currentChannelConfig,
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
    setEmailStep(1)
  }

  const handleEditChannel = (channel: ChannelConfig) => {
    setEditingChannelId(channel.id)
    setCurrentChannelType(channel.type)
    setCurrentChannelConfig(channel.config)
    setEmailStep(1)
  }

  const handleRemoveChannel = (id: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.filter(c => c.id !== id)
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
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "h-1.5 w-6 rounded-full transition-all duration-300",
                      emailStep === s ? "bg-primary w-10" : s < emailStep ? "bg-primary/60" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Step {emailStep} of 5</span>
            </div>

            {emailStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Provider Selection</h4>
                  <p className="text-xs text-muted-foreground">Choose your email provider and mailbox details.</p>
                </div>
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
                      <SelectItem value="gmail">Google Workspace / Gmail (API recommended)</SelectItem>
                      <SelectItem value="m365">Microsoft 365 / Outlook (Graph API recommended)</SelectItem>
                      <SelectItem value="imap">Other Provider (IMAP/SMTP)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground">For enterprise reliability, prefer Gmail API / Microsoft Graph over IMAP.</p>
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

                <div className="space-y-2">
                  <Label>Display name</Label>
                  <Input
                    placeholder="Support Team"
                    value={currentChannelConfig.display_name || ""}
                    onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, display_name: e.target.value })}
                  />
                </div>

                {currentChannelConfig.provider === "m365" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label>Mailbox type (M365 only)</Label>
                    <Select
                      value={currentChannelConfig.mailbox_type || "user"}
                      onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, mailbox_type: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mailbox type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User mailbox</SelectItem>
                        <SelectItem value="shared">Shared mailbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {emailStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Reply Behavior</h4>
                  <p className="text-xs text-muted-foreground">Configure how the bot interacts with incoming emails.</p>
                </div>
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Select
                    value={currentChannelConfig.routing_mode || "auto_reply"}
                    onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, routing_mode: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto_reply">Auto-reply (send replies automatically)</SelectItem>
                      <SelectItem value="draft_only">Draft-only (create draft, do not send)</SelectItem>
                      <SelectItem value="suggest_to_agent">Agent assist (suggest response for approval)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Email signature</Label>
                  <Textarea
                    placeholder="—\nServiceGen Support"
                    value={currentChannelConfig.signature || ""}
                    onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, signature: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Allowed senders (optional)</Label>
                    <Textarea
                      placeholder="customer@example.com"
                      className="text-xs"
                      value={currentChannelConfig.allowed_senders || ""}
                      onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, allowed_senders: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Blocked senders (optional)</Label>
                    <Textarea
                      placeholder="spam@bad.com"
                      className="text-xs"
                      value={currentChannelConfig.blocked_senders || ""}
                      onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, blocked_senders: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Threading</Label>
                  <Select
                    value={currentChannelConfig.threading_mode || "provider_thread_id"}
                    onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, threading_mode: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select threading mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="provider_thread_id">Use provider thread/conversation ID</SelectItem>
                      <SelectItem value="subject_refs">Use Subject + References headers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {emailStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Privacy & Attachments</h4>
                  <p className="text-xs text-muted-foreground">Control data handling and file processing.</p>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Redact PII before AI</Label>
                    <p className="text-[10px] text-muted-foreground">Automatically mask sensitive data before sending to LLM.</p>
                  </div>
                  <Switch
                    checked={currentChannelConfig.pii_redact_before_ai !== false}
                    onCheckedChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, pii_redact_before_ai: val })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Store raw email body in DB</Label>
                    <p className="text-[10px] text-muted-foreground">Recommended OFF. Store metadata + hashed content only.</p>
                  </div>
                  <Switch
                    checked={currentChannelConfig.store_raw_body === true}
                    onCheckedChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, store_raw_body: val })}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Attachments Policy</Label>
                  <Select
                    value={currentChannelConfig.attachment_policy || "ignore"}
                    onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, attachment_policy: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ignore">Ignore attachments</SelectItem>
                      <SelectItem value="metadata_only">Store metadata only</SelectItem>
                      <SelectItem value="ingest_to_kb">Ingest to Knowledge Base (RAG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(currentChannelConfig.attachment_policy === "metadata_only" || currentChannelConfig.attachment_policy === "ingest_to_kb") && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label>Max attachment size (MB)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={currentChannelConfig.max_attachment_mb || 10}
                      onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, max_attachment_mb: parseInt(e.target.value) })}
                    />
                  </div>
                )}
              </div>
            )}

            {emailStep === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Connection Settings</h4>
                  <p className="text-xs text-muted-foreground">Provider-specific credentials and webhook settings.</p>
                </div>

                {currentChannelConfig.provider === "gmail" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Auth mode</Label>
                      <Select
                        value={currentChannelConfig.gmail_auth_mode || "service_account_dwd"}
                        onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, gmail_auth_mode: val })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="service_account_dwd">Service Account (Domain-wide delegation)</SelectItem>
                          <SelectItem value="oauth_client">OAuth Client (3-legged, per mailbox)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentChannelConfig.gmail_auth_mode === "service_account_dwd" ? (
                      <>
                        <div className="space-y-2">
                          <Label>Service Account JSON</Label>
                          <Textarea
                            placeholder='{ "type": "service_account", ... }'
                            className="font-mono text-[10px]"
                            value={currentChannelConfig.gmail_service_account_json || ""}
                            onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, gmail_service_account_json: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Impersonated mailbox user</Label>
                          <Input
                            placeholder="support@company.com"
                            value={currentChannelConfig.gmail_delegated_user || ""}
                            onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, gmail_delegated_user: e.target.value })}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>OAuth Client ID</Label>
                          <Input
                            type="password"
                            value={currentChannelConfig.gmail_oauth_client_id || ""}
                            onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, gmail_oauth_client_id: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>OAuth Client Secret</Label>
                          <Input
                            type="password"
                            value={currentChannelConfig.gmail_oauth_client_secret || ""}
                            onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, gmail_oauth_client_secret: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label>Inbound mode</Label>
                      <Select
                        value={currentChannelConfig.gmail_push_mode || "push"}
                        onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, gmail_push_mode: val })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="push">Push (recommended)</SelectItem>
                          <SelectItem value="poll">Polling fallback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentChannelConfig.gmail_push_mode === "push" && (
                      <div className="space-y-3 p-3 border rounded-lg bg-muted/5">
                        <div className="space-y-2">
                          <Label className="text-xs">Pub/Sub topic</Label>
                          <Input value={currentChannelConfig.gmail_pubsub_topic || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, gmail_pubsub_topic: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Inbound webhook URL</Label>
                          <Input value={currentChannelConfig.inbound_webhook_url || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, inbound_webhook_url: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentChannelConfig.provider === "m365" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tenant ID</Label>
                      <Input placeholder="00000000-0000-0000-0000-000000000000" value={currentChannelConfig.m365_tenant_id || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, m365_tenant_id: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Client ID (App Registration)</Label>
                      <Input type="password" value={currentChannelConfig.m365_client_id || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, m365_client_id: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Client secret</Label>
                      <Input type="password" value={currentChannelConfig.m365_client_secret || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, m365_client_secret: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Inbound mode</Label>
                      <Select value={currentChannelConfig.m365_inbound_mode || "webhook"} onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, m365_inbound_mode: val })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="webhook">Webhook subscription (recommended)</SelectItem>
                          <SelectItem value="poll">Polling fallback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentChannelConfig.m365_inbound_mode === "webhook" && (
                      <div className="space-y-3 p-3 border rounded-lg bg-muted/5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-2">
                          <Label className="text-xs">Notification URL</Label>
                          <Input value={currentChannelConfig.inbound_webhook_url || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, inbound_webhook_url: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Client state secret</Label>
                          <Input type="password" value={currentChannelConfig.inbound_webhook_secret || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, inbound_webhook_secret: e.target.value })} />
                        </div>
                      </div>
                    )}

                    {currentChannelConfig.mailbox_type === "shared" && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label>Shared mailbox address</Label>
                        <Input type="email" value={currentChannelConfig.m365_shared_mailbox || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, m365_shared_mailbox: e.target.value })} />
                      </div>
                    )}
                  </div>
                )}

                {currentChannelConfig.provider === "imap" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">IMAP host</Label>
                        <Input placeholder="imap.example.com" value={currentChannelConfig.imap_host || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, imap_host: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">IMAP port</Label>
                        <Input type="number" value={currentChannelConfig.imap_port || 993} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, imap_port: parseInt(e.target.value) })} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="imap_tls"
                        checked={currentChannelConfig.imap_tls !== false}
                        onCheckedChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, imap_tls: val })}
                      />
                      <Label htmlFor="imap_tls" className="text-xs">Use TLS for IMAP</Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="space-y-2">
                        <Label className="text-xs">SMTP host</Label>
                        <Input placeholder="smtp.example.com" value={currentChannelConfig.smtp_host || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, smtp_host: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">SMTP port</Label>
                        <Input type="number" value={currentChannelConfig.smtp_port || 587} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, smtp_port: parseInt(e.target.value) })} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smtp_tls"
                        checked={currentChannelConfig.smtp_tls !== false}
                        onCheckedChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, smtp_tls: val })}
                      />
                      <Label htmlFor="smtp_tls" className="text-xs">Use STARTTLS for SMTP</Label>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <Label>Authentication</Label>
                      <Select value={currentChannelConfig.imap_auth_mode || "password"} onValueChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, imap_auth_mode: val })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oauth2">OAuth2 (recommended)</SelectItem>
                          <SelectItem value="password">Password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input value={currentChannelConfig.imap_username || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, imap_username: e.target.value })} />
                    </div>

                    {currentChannelConfig.imap_auth_mode === "password" ? (
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <Label>Password</Label>
                        <Input type="password" value={currentChannelConfig.imap_password || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, imap_password: e.target.value })} />
                      </div>
                    ) : (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">OAuth Client ID</Label>
                            <Input type="password" value={currentChannelConfig.oauth_client_id || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, oauth_client_id: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">OAuth Client Secret</Label>
                            <Input type="password" value={currentChannelConfig.oauth_client_secret || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, oauth_client_secret: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">OAuth Token URL</Label>
                          <Input placeholder="https://..." value={currentChannelConfig.oauth_token_url || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, oauth_token_url: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">OAuth Scopes</Label>
                          <Input placeholder="https://mail.google.com/, ..." value={currentChannelConfig.oauth_scopes || ""} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, oauth_scopes: e.target.value })} />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="idle_enabled"
                          checked={currentChannelConfig.idle_enabled !== false}
                          onCheckedChange={(val) => setCurrentChannelConfig({ ...currentChannelConfig, idle_enabled: val })}
                        />
                        <Label htmlFor="idle_enabled" className="text-xs">Use IMAP IDLE</Label>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Polling fallback (sec)</Label>
                        <Input type="number" min={15} max={900} value={currentChannelConfig.poll_fallback_seconds || 60} onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, poll_fallback_seconds: parseInt(e.target.value) })} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {emailStep === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Review & Test</h4>
                  <p className="text-xs text-muted-foreground">Verify your configuration before adding the channel.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/5">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Test Inbound</p>
                      <p className="text-[10px] text-muted-foreground">Verify that ServiceGen can receive emails.</p>
                    </div>
                    <Button variant="outline" size="sm" type="button" onClick={() => console.log("Testing inbound...")}>
                      Run Test
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/5">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Test Outbound</p>
                      <p className="text-[10px] text-muted-foreground">Send a test reply from ServiceGen.</p>
                    </div>
                    <Button variant="outline" size="sm" type="button" onClick={() => console.log("Testing outbound...")}>
                      Run Test
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Summary</p>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="font-medium capitalize">{currentChannelConfig.provider}</span>
                    <span className="text-muted-foreground">Mailbox:</span>
                    <span className="font-medium truncate">{currentChannelConfig.mailbox_address}</span>
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="font-medium">{currentChannelConfig.routing_mode}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      case "telephone":
        return (
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              placeholder="+1 (555) 000-0000"
              value={currentChannelConfig.phoneNumber || ""}
              onChange={(e) => setCurrentChannelConfig({ ...currentChannelConfig, phoneNumber: e.target.value })}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container py-8 max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create a new service</h1>
        <p className="text-muted-foreground">
          Configure your AI service in just a few steps.
        </p>
      </div>

      <Progress value={(step / totalSteps) * 100} className="h-2" />

      <Card className="p-6">
        <form className="space-y-8">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Service Details</h2>
                <p className="text-sm text-muted-foreground">
                  Basic information to identify this service within your organization.
                </p>
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
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Bot Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Define the personality and instructions for your AI agent.
                </p>
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
                  placeholder="Internal bot for answering questions about employee benefits."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">System Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="You are a helpful HR assistant. You answer questions based on the provided policy documents..."
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
          )}

          {step === 3 && (
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
                  value={formData.dataSourceType}
                  onValueChange={(val: DataSourceType) => handleChange("dataSourceType", val)}
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

              {formData.dataSourceType === "url" && (
                <div className="space-y-2">
                  <Label htmlFor="url-source">Document URLs</Label>
                  <Textarea
                    id="url-source"
                    placeholder="https://example.com/policy, https://intranet.company.com/docs"
                    value={formData.dataSourceValue}
                    onChange={(e) => handleChange("dataSourceValue", e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple URLs with commas.
                  </p>
                </div>
              )}

              {formData.dataSourceType === "file" && (
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload Document</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      handleChange("dataSourceFile", file)
                    }}
                    className="cursor-pointer"
                  />
                  {formData.dataSourceFile && (
                    <p className="text-sm text-green-600">
                      Selected: {formData.dataSourceFile.name}
                    </p>
                  )}
                </div>
              )}

              {formData.dataSourceType === "aws_s3" && (
                <div className="space-y-2">
                  <Label htmlFor="s3-source">S3 Bucket URL</Label>
                  <Input
                    id="s3-source"
                    placeholder="s3://my-company-docs/policies/"
                    value={formData.dataSourceValue}
                    onChange={(e) => handleChange("dataSourceValue", e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {step === 4 && (
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
                          <TableCell className="text-sm text-muted-foreground">
                            {Object.values(channel.config).join(", ")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditChannel(channel)}
                                type="button"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveChannel(channel.id)}
                                type="button"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Add/Edit Channel Form */}
              <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                <h3 className="font-medium flex items-center gap-2">
                  {editingChannelId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingChannelId ? "Edit Channel" : "Add New Channel"}
                </h3>

                <div className="space-y-2">
                  <Label>Channel Type</Label>
                  <Select
                    value={currentChannelType}
                    onValueChange={(val: ChannelType) => {
                      setCurrentChannelType(val)
                      setCurrentChannelConfig({}) // Reset config on type change
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNEL_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          <span className="mr-2">{type.icon}</span>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {renderChannelConfigInputs()}

                <div className="flex justify-end gap-2">
                  {(editingChannelId || (currentChannelType === "email" && emailStep > 1)) && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (currentChannelType === "email" && emailStep > 1) {
                          setEmailStep(1)
                        } else {
                          setEditingChannelId(null)
                          setCurrentChannelConfig({})
                          setEmailStep(1)
                        }
                      }}
                      type="button"
                    >
                      {currentChannelType === "email" && emailStep > 1 ? "Back" : "Cancel"}
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      if (currentChannelType === "email" && emailStep < 5) {
                        setEmailStep(emailStep + 1)
                      } else {
                        handleAddChannel()
                      }
                    }}
                    type="button"
                  >
                    {currentChannelType === "email" && emailStep < 5 ? "Next" : (editingChannelId ? "Update Channel" : "Add Channel")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Assign Agent</h2>
                <p className="text-sm text-muted-foreground">
                  Select a human agent to handle escalations or monitor this service.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Select Agent</Label>
                <Popover open={openAgentSelect} onOpenChange={setOpenAgentSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openAgentSelect}
                      className="w-full justify-between"
                      type="button"
                    >
                      {formData.agentId
                        ? AGENTS.find((agent) => agent.value === formData.agentId)?.label
                        : "Select agent..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Search agent..." />
                      <CommandList>
                        <CommandEmpty>No agent found.</CommandEmpty>
                        <CommandGroup>
                          {AGENTS.map((agent) => (
                            <CommandItem
                              key={agent.value}
                              value={agent.value}
                              onSelect={(currentValue) => {
                                handleChange("agentId", currentValue === formData.agentId ? "" : currentValue)
                                setOpenAgentSelect(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.agentId === agent.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {agent.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div /> /* Spacer */
            )}

            {step < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleFormSubmit}>Create Service</Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}