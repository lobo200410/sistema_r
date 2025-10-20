import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { isSuperAdmin } from "@/lib/admin"
import AdminPanel from "@/components/admin-panel"

export default async function AdminPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const isAdmin = await isSuperAdmin(user.id)

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return <AdminPanel />
}
