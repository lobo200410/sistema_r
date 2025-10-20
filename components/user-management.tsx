"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Shield, Power, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { searchUsers, getAllUsersWithRoles, toggleUserStatus, deleteUser, type UserWithRole } from "@/app/actions/users"
import { useToast } from "@/hooks/use-toast"

export function UserManagement() {
  const [allUsers, setAllUsers] = useState<UserWithRole[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserWithRole | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const { toast } = useToast()

  // Cargar usuarios inicialmente
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllUsersWithRoles()
      setAllUsers(data)
      setCurrentPage(1) // Reset a la primera página
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Buscar usuarios cuando cambia el término de búsqueda
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadUsers()
      return
    }

    setLoading(true)
    try {
      const data = await searchUsers(searchTerm)
      setAllUsers(data)
      setCurrentPage(1) // Reset a la primera página
    } catch (error) {
      console.error("Error searching users:", error)
      toast({
        title: "Error",
        description: "Error al buscar usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(allUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = allUsers.slice(startIndex, endIndex)

  const handleEditUser = (user: UserWithRole) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedUser(null)
    loadUsers() // Recargar usuarios después de editar
  }

  const handleToggleStatus = async (user: UserWithRole) => {
    try {
      await toggleUserStatus(user.id, !user.is_active)
      toast({
        title: "Éxito",
        description: `Usuario ${user.is_active ? "deshabilitado" : "habilitado"} correctamente`,
      })
      loadUsers()
    } catch (error) {
      console.error("Error toggling user status:", error)
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del usuario",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (user: UserWithRole) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete.id)
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      })
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
      loadUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeColor = (roleName: string | null) => {
    switch (roleName) {
      case "superadmin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "coordinador":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "docente":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Shield className="h-4 w-4 md:h-5 md:w-5" />
            Gestión de Usuarios
          </CardTitle>
          <CardDescription className="text-sm">
            Busca y administra usuarios del sistema. Puedes modificar información, cambiar contraseñas y asignar roles.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {/* Barra de búsqueda */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4 md:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
                className="pl-10 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={loading} size="sm" className="flex-1 sm:flex-none">
                Buscar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  loadUsers()
                }}
                className="flex-1 sm:flex-none"
              >
                Limpiar
              </Button>
            </div>
          </div>

          {/* Tabla de usuarios */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Cargando usuarios...</div>
          ) : allUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No se encontraron usuarios</div>
          ) : (
            <>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Usuario</TableHead>
                      <TableHead className="min-w-[150px]">Nombre</TableHead>
                      <TableHead className="min-w-[180px]">Correo</TableHead>
                      <TableHead className="min-w-[100px]">Rol</TableHead>
                      <TableHead className="min-w-[80px]">Estado</TableHead>
                      <TableHead className="min-w-[120px]">Fecha</TableHead>
                      <TableHead className="text-right min-w-[120px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-sm">{user.username}</TableCell>
                        <TableCell className="text-sm">{user.name}</TableCell>
                        <TableCell className="text-sm">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role_name)}>{user.role_name || "Sin rol"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? "default" : "secondary"}>
                            {user.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(user.created_at).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)} title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(user)}
                              title={user.is_active ? "Deshabilitar" : "Habilitar"}
                              className={
                                user.is_active
                                  ? "text-orange-600 hover:text-orange-700"
                                  : "text-green-600 hover:text-green-700"
                              }
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(user)}
                              title="Eliminar"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                  <div className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, allUsers.length)} de {allUsers.length} usuarios
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Anterior</span>
                    </Button>
                    <div className="text-xs md:text-sm whitespace-nowrap">
                      Página {currentPage} de {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <span className="hidden sm:inline mr-1">Siguiente</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog para editar usuario */}
      {selectedUser && <EditUserDialog user={selectedUser} open={isEditDialogOpen} onClose={handleCloseDialog} />}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario <strong>{userToDelete?.username}</strong>. Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
