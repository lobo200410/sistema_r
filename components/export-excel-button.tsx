"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, X } from "lucide-react"
import type { Resource } from "@/lib/resources"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ExportExcelButtonProps {
  resources: Resource[]
}

export function ExportExcelButton({ resources }: ExportExcelButtonProps) {
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [filterPlatform, setFilterPlatform] = useState<string>("todos")
  const [filterFaculty, setFilterFaculty] = useState<string>("todos")
  const [filterCycle, setFilterCycle] = useState<string>("todos")
  const [filterType, setFilterType] = useState<string>("todos")
  const [filterPublished, setFilterPublished] = useState<string>("todos")

  const platforms = useMemo(() => {
    const unique = Array.from(new Set(resources.map((r) => r.plataforma)))
    return unique.sort()
  }, [resources])

  const faculties = useMemo(() => {
    const unique = Array.from(new Set(resources.map((r) => r.facultad)))
    return unique.sort()
  }, [resources])

  const cycles = useMemo(() => {
    const unique = Array.from(new Set(resources.map((r) => r.ciclo)))
    return unique.sort()
  }, [resources])

  const types = useMemo(() => {
    const unique = Array.from(new Set(resources.map((r) => r.tipo)))
    return unique.sort()
  }, [resources])

  const filteredCount = useMemo(() => {
    return resources.filter((resource) => {
      const matchesPlatform = filterPlatform === "todos" || resource.plataforma === filterPlatform
      const matchesFaculty = filterFaculty === "todos" || resource.facultad === filterFaculty
      const matchesCycle = filterCycle === "todos" || resource.ciclo === filterCycle
      const matchesType = filterType === "todos" || resource.tipo === filterType
      const matchesPublished =
        filterPublished === "todos" ||
        (filterPublished === "publicados" && resource.publicado) ||
        (filterPublished === "no-publicados" && !resource.publicado)

      return matchesPlatform && matchesFaculty && matchesCycle && matchesType && matchesPublished
    }).length
  }, [resources, filterPlatform, filterFaculty, filterCycle, filterType, filterPublished])

  const clearFilters = () => {
    setFilterPlatform("todos")
    setFilterFaculty("todos")
    setFilterCycle("todos")
    setFilterType("todos")
    setFilterPublished("todos")
  }

  async function handleExportExcel() {
    try {
      setLoading(true)

      const response = await fetch("/api/export-excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resources,
          filters: {
            ciclo: filterCycle,
            facultad: filterFaculty,
            plataforma: filterPlatform,
            tipo: filterType,
            publicado: filterPublished,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al generar el archivo Excel: ${response.status} - ${errorText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `reporte_recursos_${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error exporting Excel:", error)
      alert(`Error al exportar a Excel: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        disabled={resources.length === 0}
        className="text-white font-semibold"
        style={{ backgroundColor: "#5D0A28" }}
      >
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Exportar a Excel
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Exportar Recursos a Excel</DialogTitle>
            <DialogDescription>
              Selecciona los filtros para exportar los recursos. Se exportarán {filteredCount} de {resources.length}{" "}
              recursos.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Platform filter */}
            <div className="grid gap-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Todas las plataformas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las plataformas</SelectItem>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Faculty filter */}
            <div className="grid gap-2">
              <Label htmlFor="faculty">Facultad</Label>
              <Select value={filterFaculty} onValueChange={setFilterFaculty}>
                <SelectTrigger id="faculty">
                  <SelectValue placeholder="Todas las facultades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las facultades</SelectItem>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cycle filter */}
            <div className="grid gap-2">
              <Label htmlFor="cycle">Ciclo</Label>
              <Select value={filterCycle} onValueChange={setFilterCycle}>
                <SelectTrigger id="cycle">
                  <SelectValue placeholder="Todos los ciclos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los ciclos</SelectItem>
                  {cycles.map((cycle) => (
                    <SelectItem key={cycle} value={cycle}>
                      {cycle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type filter */}
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de recurso</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Published filter */}
            <div className="grid gap-2">
              <Label htmlFor="published">Estado de publicación</Label>
              <Select value={filterPublished} onValueChange={setFilterPublished}>
                <SelectTrigger id="published">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="publicados">Publicados</SelectItem>
                  <SelectItem value="no-publicados">No publicados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleExportExcel}
                disabled={loading || filteredCount === 0}
                className="text-white"
                style={{ backgroundColor: "#5D0A28" }}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {loading ? "Exportando..." : "Exportar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
