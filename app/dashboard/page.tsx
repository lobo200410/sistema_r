import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { getAllResources } from "@/app/actions/resources"
import { isSuperAdmin } from "@/lib/admin"
import { DashboardStats } from "@/components/dashboard-stats"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const resources = await getAllResources()
  const isAdmin = await isSuperAdmin(user.id)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <DashboardHeader user={user} isSuperAdmin={isAdmin} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600">Resumen general del sistema de recursos educativos</p>
        </div>

        <DashboardStats resources={resources} />
      </main>
    </div>
  )
}
