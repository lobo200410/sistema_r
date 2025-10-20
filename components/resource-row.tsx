"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, ExternalLink, Trash2 } from "lucide-react"
import { ResourceDialog } from "@/components/resource-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteExistingResource } from "@/app/actions/resources"
import { getCurrentUserRole } from "@/app/actions/admin"
import type { Resource } from "@/lib/resources"

interface ResourceRowProps {
  resource: Resource
  onUpdate: (resource: Resource) => void
  onDelete: (id: string) => void
}

const platformColors = {
  Canva: "bg-blue-100 text-blue-800",
  Genially: "bg-purple-100 text-purple-800",
  Flickbook: "bg-green-100 text-green-800",
  Lumi: "bg-orange-100 text-orange-800",
}

export function ResourceRow({ resource, onUpdate, onDelete }: ResourceRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [userRole, setUserRole] = useState<string>("")

  useEffect(() => {
    async function loadUserRole() {
      const role = await getCurrentUserRole()
      setUserRole(role)
    }
    loadUserRole()
  }, [])

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteExistingResource(resource.id)
      if (result.error) {
        alert(result.error)
        setIsDeleteOpen(false)
        return
      }
      onDelete(resource.id)
      setIsDeleteOpen(false)
    })
  }

  const canDelete = userRole === "coordinador" || userRole === "superadmin"

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">{resource.titulo}</div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
          >
            Ver recurso
            <ExternalLink className="w-3 h-3" />
          </a>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-600 max-w-xs truncate" title={resource.descripcion}>
            {resource.descripcion || "Sin descripción"}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-600">{resource.tipo}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-600">{resource.ciclo}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-600">{resource.facultad}</div>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${platformColors[resource.plataforma] || "bg-gray-100 text-gray-800"}`}
          >
            {resource.plataforma}
          </span>
        </td>
        <td className="px-6 py-4 text-center">
          <Badge variant={resource.publicado ? "default" : "secondary"}>
            {resource.publicado ? "Publicado" : "Borrador"}
          </Badge>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>
              <Edit className="w-4 h-4" />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </td>
      </tr>

      <ResourceDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onUpdate}
        mode="edit"
        resource={resource}
      />

      {canDelete && (
        <DeleteConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={handleDelete}
          isPending={isPending}
          resourceTitle={resource.titulo}
        />
      )}
    </>
  )
}
