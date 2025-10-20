"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  updateUser,
  updateUserPassword,
  updateUserRole,
  getAllRolesForSelect,
  type UserWithRole,
} from "@/app/actions/users"
import { useToast } from "@/hooks/use-toast"

interface EditUserDialogProps {
  user: UserWithRole
  open: boolean
  onClose: () => void
}

export function EditUserDialog({ user, open, onClose }: EditUserDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<Array<{ id: number; name: string; description: string }>>([])

  // Información básica
  const [username, setUsername] = useState(user.username)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [isActive, setIsActive] = useState(user.is_active)

  // Contraseña
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Rol
  const [selectedRoleId, setSelectedRoleId] = useState<string>(user.role_id?.toString() || "")

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const data = await getAllRolesForSelect()
      setRoles(data)
    } catch (error) {
      console.error("Error loading roles:", error)
    }
  }

  const handleSaveBasicInfo = async () => {
    setLoading(true)
    try {
      await updateUser(user.id, {
        username,
        name,
        email,
        is_active: isActive,
      })

      toast({
        title: "Usuario actualizado",
        description: "La información del usuario se actualizó correctamente",
      })

      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Debes completar ambos campos de contraseña",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await updateUserPassword(user.id, newPassword)

      toast({
        title: "Contraseña actualizada",
        description: "La contraseña se cambió correctamente",
      })

      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar la contraseña",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async () => {
    if (!selectedRoleId) {
      toast({
        title: "Error",
        description: "Debes seleccionar un rol",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await updateUserRole(user.id, Number.parseInt(selectedRoleId))

      toast({
        title: "Rol actualizado",
        description: "El rol del usuario se actualizó correctamente",
      })

      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el rol",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>Modifica la información, contraseña o rol del usuario</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="password">Contraseña</TabsTrigger>
            <TabsTrigger value="role">Rol</TabsTrigger>
          </TabsList>

          {/* Tab: Información básica */}
          <TabsContent value="info" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nombre.apellido"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Pérez" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@utec.edu.sv"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="is-active">Usuario activo</Label>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSaveBasicInfo} disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Tab: Cambiar contraseña */}
          <TabsContent value="password" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleChangePassword} disabled={loading}>
                {loading ? "Cambiando..." : "Cambiar Contraseña"}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Tab: Cambiar rol */}
          <TabsContent value="role" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol del Usuario</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.name}</span>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Rol actual:</strong> {user.role_name || "Sin rol asignado"}
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleChangeRole} disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Rol"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
