"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Bot,
    BarChart3,
    Settings,
    ChevronDown,
    ChevronRight,
    Menu,
    X
} from "lucide-react"

interface NavItem {
    title: string
    href: string
    icon: any
    children?: NavItem[]
}

const navigation: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Services",
        href: "/dashboard/services",
        icon: Bot,
        children: [
            { title: "All Services", href: "/dashboard/services", icon: null },
            { title: "Create New", href: "/dashboard/services/new", icon: null }
        ]
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        children: [
            { title: "Organization", href: "/dashboard/organization/general", icon: null },
            { title: "Account", href: "/dashboard/account", icon: null },
            { title: "Users", href: "/dashboard/users", icon: null }
        ]
    }
]

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [expandedItems, setExpandedItems] = useState<string[]>(["Services", "Settings"])
    const pathname = usePathname()

    const toggleExpand = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(item => item !== title)
                : [...prev, title]
        )
    }

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === href
        }
        return pathname.startsWith(href)
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-md"
            >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300",
                    collapsed ? "w-16" : "w-64",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-4 border-b">
                        {!collapsed ? (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg">ServiceGen</span>
                            </div>
                        ) : (
                            <Bot className="w-6 h-6 mx-auto text-indigo-600" />
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {navigation.map((item) => (
                            <NavItemComponent
                                key={item.title}
                                item={item}
                                collapsed={collapsed}
                                isActive={isActive}
                                isExpanded={expandedItems.includes(item.title)}
                                onToggle={() => item.children && toggleExpand(item.title)}
                            />
                        ))}
                    </nav>

                    {/* Collapse Toggle */}
                    <div className="border-t p-4">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex items-center justify-center w-full py-2 rounded-md hover:bg-muted transition-colors"
                            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <ChevronRight
                                className={cn(
                                    "w-5 h-5 transition-transform",
                                    !collapsed && "rotate-180"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

function NavItemComponent({
    item,
    collapsed,
    isActive,
    isExpanded,
    onToggle
}: {
    item: NavItem
    collapsed: boolean
    isActive: (href: string) => boolean
    isExpanded: boolean
    onToggle: () => void
}) {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0

    return (
        <div>
            {hasChildren ? (
                <button
                    onClick={onToggle}
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors",
                        isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                    )}
                >
                    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                    {!collapsed && (
                        <>
                            <span className="flex-1 text-left">{item.title}</span>
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </>
                    )}
                </button>
            ) : (
                <Link
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                    )}
                >
                    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                    {!collapsed && <span>{item.title}</span>}
                </Link>
            )}

            {/* Children */}
            {hasChildren && isExpanded && !collapsed && (
                <div className="ml-8 mt-1 space-y-1">
                    {item.children!.map((child) => (
                        <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                                "block px-3 py-1.5 text-sm rounded-md transition-colors",
                                isActive(child.href)
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {child.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
