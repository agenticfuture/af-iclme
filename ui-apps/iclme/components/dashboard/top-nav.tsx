"use client"

import { useState } from "react"
import { Bell, User, LogOut, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { signOut } from "@/lib/auth"

export function TopNav() {
    const [notificationCount] = useState(3)

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            {/* Search */}
            <div className="flex-1">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search or press Cmd+K..."
                        className="w-full pl-10 pr-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5" />
                            {notificationCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                                >
                                    {notificationCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-96 overflow-y-auto">
                            <NotificationItem
                                title="Service deployed successfully"
                                description="Customer Support Bot is now live"
                                time="2 minutes ago"
                            />
                            <NotificationItem
                                title="New user joined"
                                description="john@example.com joined your organization"
                                time="1 hour ago"
                            />
                            <NotificationItem
                                title="High API usage detected"
                                description="Sales Assistant exceeded 80% of quota"
                                time="3 hours ago"
                            />
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-center justify-center text-sm text-muted-foreground">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="hidden sm:inline">Dev User</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">Dev User</p>
                                <p className="text-xs text-muted-foreground">
                                    dev@servicegen.local
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="w-4 h-4 mr-2" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

function NotificationItem({
    title,
    description,
    time
}: {
    title: string
    description: string
    time: string
}) {
    return (
        <div className="px-3 py-2 hover:bg-muted cursor-pointer">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground mt-1">{time}</p>
        </div>
    )
}
