import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { isSuperAdmin } from "@/lib/admin"
import { UserManagement } from "@/components/user-management"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserCog } from "lucide-react"
import Link from "next/link"

export default async function UsersPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const isAdmin = await isSuperAdmin(user.id)

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
      <header className="border-b border-gray-200" style={{ backgroundColor: "#5D0A28" }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <UserCog className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Gestión de Usuarios</h1>
                <p className="text-sm text-white/80">Administrar usuarios del sistema</p>
              </div>
            </div>

            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-[#5D0A28] border-white hover:bg-white/90 hover:text-[#5D0A28]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <UserManagement />
      </main>
    </div>
  )
}
