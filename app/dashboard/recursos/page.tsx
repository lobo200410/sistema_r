import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { ResourcesTable } from "@/components/resources-table"
import { getAllResources } from "@/app/actions/resources"
import { ExportExcelButton } from "@/components/export-excel-button"
import { isSuperAdmin } from "@/lib/admin"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function RecursosPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const resources = await getAllResources()
  const isAdmin = await isSuperAdmin(user.id)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <DashboardHeader user={user} isSuperAdmin={isAdmin} />

      <main className="mx-auto max-w-7xl px-4 py-8 animate-in fade-in duration-700">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-[#5D0A28] text-[#5D0A28] hover:bg-[#5D0A28] hover:text-white bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">Recursos Educativos</h1>
              <p className="text-gray-600">Gestión de los recursos Canva, Genially, Flickbook y Lumi</p>
            </div>
            <ExportExcelButton resources={resources} />
          </div>
        </div>

        <ResourcesTable resources={resources} />
      </main>
    </div>
  )
}
