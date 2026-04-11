import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth check commented out for development
  // const session = await auth()
  // if (!session) {
  //   redirect("/")
  // }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <TopNav />

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
