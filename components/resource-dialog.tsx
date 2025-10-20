"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createNewResource, updateExistingResource } from "@/app/actions/resources"
import { getPublicPlatforms, getPublicFaculties, getPublicCycles, getPublicResourceTypes } from "@/app/actions/admin"
import type { Resource } from "@/lib/resources"

interface ResourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (resource: Resource) => void
  mode: "create" | "edit"
  resource?: Resource
}

export function ResourceDialog({ open, onOpenChange, onSuccess, mode, resource }: ResourceDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [platforms, setPlatforms] = useState<any[]>([])
  const [faculties, setFaculties] = useState<any[]>([])
  const [cycles, setCycles] = useState<any[]>([])
  const [types, setTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [platformId, setPlatformId] = useState<string>("")
  const [typeId, setTypeId] = useState<string>("")
  const [cycleId, setCycleId] = useState<string>("")
  const [facultyId, setFacultyId] = useState<string>("")
  const [publicado, setPublicado] = useState<boolean>(resource?.publicado ?? true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [platformsData, facultiesData, cyclesData, typesData] = await Promise.all([
        getPublicPlatforms(),
        getPublicFaculties(),
        getPublicCycles(),
        getPublicResourceTypes(),
      ])
      setPlatforms(platformsData.filter((p) => p.is_active))
      setFaculties(facultiesData.filter((f) => f.is_active))
      setCycles(cyclesData.filter((c) => c.is_active))
      setTypes(typesData.filter((t) => t.is_active))
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set("publicado", publicado.toString())
    formData.set("typeId", typeId)
    formData.set("cycleId", cycleId)
    formData.set("facultyId", facultyId)
    formData.set("platformId", platformId)

    startTransition(async () => {
      try {
        if (mode === "create") {
          const result = await createNewResource(formData)
          if (result.success && result.resource) {
            onSuccess(result.resource)
          } else {
            setError("Error al guardar el recurso")
          }
        } else if (resource) {
          const result = await updateExistingResource(resource.id, formData)
          if (result.success) {
            const updatedResource: Resource = {
              ...resource,
              titulo: formData.get("titulo") as string,
              descripcion: formData.get("descripcion") as string,
              url: formData.get("url") as string,
              tipo: types.find((t) => t.id === Number.parseInt(typeId))?.name || resource.tipo,
              ciclo: cycles.find((c) => c.id === Number.parseInt(cycleId))?.name || resource.ciclo,
              publicado: publicado,
              facultad: faculties.find((f) => f.id === Number.parseInt(facultyId))?.name || resource.facultad,
              plataforma: platforms.find((p) => p.id === Number.parseInt(platformId))?.name || resource.plataforma,
              updatedAt: new Date(),
            }
            onSuccess(updatedResource)
          } else {
            setError(result.error || "Error al actualizar el recurso")
          }
        }
      } catch (err) {
        console.error("[v0] Error al guardar:", err)
        setError("Error al guardar el recurso")
      }
    })
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="p-8 text-center">Cargando...</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-[95vw] max-w-[95vw] sm:w-full">
        <DialogHeader className="px-4 sm:px-6">
          <DialogTitle className="text-base sm:text-lg">
            {mode === "create" ? "Nuevo Recurso" : "Editar Recurso"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {mode === "create"
              ? "Completa el formulario para agregar un nuevo recurso educativo"
              : "Modifica los campos que desees actualizar"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 px-4 sm:px-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="titulo" className="text-sm">
                  Nombre del recurso *
                </Label>
                <Input
                  id="titulo"
                  name="titulo"
                  placeholder="Ej: Presentación de Matemáticas"
                  defaultValue={resource?.titulo}
                  required
                  disabled={isPending}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="descripcion" className="text-sm">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Describe brevemente el recurso..."
                  defaultValue={resource?.descripcion}
                  disabled={isPending}
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="url" className="text-sm">
                  URL *
                </Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://..."
                  defaultValue={resource?.url}
                  required
                  disabled={isPending}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeId" className="text-sm">
                  Tipo de recurso *
                </Label>
                <Select name="typeId" value={typeId} onValueChange={setTypeId} disabled={isPending} required>
                  <SelectTrigger id="typeId" className="text-sm">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()} className="text-sm">
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platformId" className="text-sm">
                  Plataforma *
                </Label>
                <Select
                  name="platformId"
                  value={platformId}
                  onValueChange={setPlatformId}
                  disabled={isPending}
                  required
                >
                  <SelectTrigger id="platformId" className="text-sm">
                    <SelectValue placeholder="Selecciona una plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id.toString()} className="text-sm">
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycleId" className="text-sm">
                  Ciclo *
                </Label>
                <Select name="cycleId" value={cycleId} onValueChange={setCycleId} disabled={isPending} required>
                  <SelectTrigger id="cycleId" className="text-sm">
                    <SelectValue placeholder="Selecciona un ciclo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cycles.map((cycle) => (
                      <SelectItem key={cycle.id} value={cycle.id.toString()} className="text-sm">
                        {cycle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facultyId" className="text-sm">
                  Facultad *
                </Label>
                <Select name="facultyId" value={facultyId} onValueChange={setFacultyId} disabled={isPending} required>
                  <SelectTrigger id="facultyId" className="text-sm">
                    <SelectValue placeholder="Selecciona una facultad" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id.toString()} className="text-sm">
                        {faculty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="publicado" className="text-sm">
                    Publicado
                  </Label>
                  <Switch id="publicado" checked={publicado} onCheckedChange={setPublicado} disabled={isPending} />
                </div>
                <p className="text-xs text-gray-500">
                  {publicado ? "El recurso está visible para todos" : "El recurso está oculto"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="px-4 sm:px-6 flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto text-white hover:opacity-90 text-sm"
              style={{ backgroundColor: "#5D0A28" }}
            >
              {isPending ? "Guardando..." : mode === "create" ? "Crear Recurso" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
