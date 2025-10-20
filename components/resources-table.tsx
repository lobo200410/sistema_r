"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Filter, X } from "lucide-react"
import { ResourceDialog } from "@/components/resource-dialog"
import { ResourceRow } from "@/components/resource-row"
import type { Resource } from "@/lib/resources"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface ResourcesTableProps {
  resources: Resource[]
}

export function ResourcesTable({ resources: initialResources }: ResourcesTableProps) {
  const [resources, setResources] = useState(initialResources)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [filterFaculty, setFilterFaculty] = useState<string>("all")
  const [filterCycle, setFilterCycle] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPublished, setFilterPublished] = useState<string>("all")

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

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        searchTerm === "" ||
        resource.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.asignatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.docente.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPlatform = filterPlatform === "all" || resource.plataforma === filterPlatform
      const matchesFaculty = filterFaculty === "all" || resource.facultad === filterFaculty
      const matchesCycle = filterCycle === "all" || resource.ciclo === filterCycle
      const matchesType = filterType === "all" || resource.tipo === filterType
      const matchesPublished =
        filterPublished === "all" ||
        (filterPublished === "published" && resource.publicado) ||
        (filterPublished === "unpublished" && !resource.publicado)

      return matchesSearch && matchesPlatform && matchesFaculty && matchesCycle && matchesType && matchesPublished
    })
  }, [resources, searchTerm, filterPlatform, filterFaculty, filterCycle, filterType, filterPublished])

  const clearFilters = () => {
    setSearchTerm("")
    setFilterPlatform("all")
    setFilterFaculty("all")
    setFilterCycle("all")
    setFilterType("all")
    setFilterPublished("all")
  }

  const hasActiveFilters =
    searchTerm !== "" ||
    filterPlatform !== "all" ||
    filterFaculty !== "all" ||
    filterCycle !== "all" ||
    filterType !== "all" ||
    filterPublished !== "all"

  const handleResourceCreated = (newResource: Resource) => {
    setResources([newResource, ...resources])
    setIsDialogOpen(false)
  }

  const handleResourceUpdated = (updatedResource: Resource) => {
    setResources(resources.map((r) => (r.id === updatedResource.id ? updatedResource : r)))
  }

  const handleResourceDeleted = (id: string) => {
    setResources(resources.filter((r) => r.id !== id))
  }

  return (
    <div className="bg-white rounded-lg border-0 shadow-md" style={{ borderTop: "4px solid #5D0A28" }}>
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Lista de Recursos</h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Mostrando {filteredResources.length} de {resources.length} recursos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="border-[#5D0A28] text-[#5D0A28] hover:bg-[#5D0A28] hover:text-white w-full sm:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-2 bg-[#5D0A28] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  !
                </span>
              )}
            </Button>

            <Button
              onClick={() => setIsDialogOpen(true)}
              size="sm"
              className="text-white hover:opacity-90 transition-opacity w-full sm:w-auto"
              style={{ backgroundColor: "#5D0A28" }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Recurso
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Filtrar recursos</h3>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-[#5D0A28] hover:text-[#5D0A28] hover:bg-[#5D0A28]/10"
                >
                  <X className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Limpiar filtros</span>
                  <span className="sm:hidden">Limpiar</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {/* Search input */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <Input
                  placeholder="Buscar por nombre, asignatura o docente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Platform filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las plataformas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las plataformas</SelectItem>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Faculty filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facultad</label>
                <Select value={filterFaculty} onValueChange={setFilterFaculty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las facultades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las facultades</SelectItem>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty} value={faculty}>
                        {faculty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cycle filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo</label>
                <Select value={filterCycle} onValueChange={setFilterCycle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los ciclos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los ciclos</SelectItem>
                    {cycles.map((cycle) => (
                      <SelectItem key={cycle} value={cycle}>
                        {cycle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de recurso</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Published filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <Select value={filterPublished} onValueChange={setFilterPublished}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="published">Publicados</SelectItem>
                    <SelectItem value="unpublished">No publicados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredResources.length === 0 ? (
        <div className="p-8 md:p-12 text-center">
          {hasActiveFilters ? (
            <>
              <p className="text-sm md:text-base text-gray-500 mb-4">
                No se encontraron recursos con los filtros aplicados
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="border-[#5D0A28] text-[#5D0A28] hover:bg-[#5D0A28] hover:text-white bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar filtros
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm md:text-base text-gray-500 mb-4">No tienes recursos registrados aún</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                size="sm"
                className="border-[#5D0A28] text-[#5D0A28] hover:bg-[#5D0A28] hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear tu primer recurso
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciclo
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facultad
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plataforma
                </th>
                <th className="px-4 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResources.map((resource) => (
                <ResourceRow
                  key={resource.id}
                  resource={resource}
                  onUpdate={handleResourceUpdated}
                  onDelete={handleResourceDeleted}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ResourceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleResourceCreated}
        mode="create"
      />
    </div>
  )
}
