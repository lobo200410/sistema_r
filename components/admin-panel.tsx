"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Users,
  Database,
  Calendar,
  FileType,
  Layers,
  ArrowLeft,
  UserCog,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react"
import {
  getPlatforms,
  addPlatform,
  removePlatform,
  getFaculties,
  addFaculty,
  removeFaculty,
  getCycles,
  addCycle,
  removeCycle,
  getResourceTypes,
  addResourceType,
  removeResourceType,
  getAllUsers,
  assignUserRole,
  getAllRoles,
  bulkUploadUsers,
  togglePlatformStatus,
  toggleFacultyStatus,
  toggleCycleStatus,
  toggleResourceTypeStatus,
} from "@/app/actions/admin"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("platforms")
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Header */}
      <header className="bg-[#5D0A28] text-white py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
              <div>
                <h1 className="text-lg md:text-xl font-bold">Panel de Administración</h1>
                <p className="text-xs md:text-sm text-white/80">Gestión del sistema - Solo Superadmin</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/users")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto justify-start sm:justify-center"
              >
                <UserCog className="h-4 w-4 mr-2" />
                Gestión de Usuarios
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto justify-start sm:justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-white gap-1 h-auto p-1">
            <TabsTrigger value="platforms" className="text-xs sm:text-sm py-2">
              <Layers className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Plataformas</span>
              <span className="sm:hidden">Plataf.</span>
            </TabsTrigger>
            <TabsTrigger value="faculties" className="text-xs sm:text-sm py-2">
              <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Facultades</span>
              <span className="sm:hidden">Facult.</span>
            </TabsTrigger>
            <TabsTrigger value="cycles" className="text-xs sm:text-sm py-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Ciclos
            </TabsTrigger>
            <TabsTrigger value="types" className="text-xs sm:text-sm py-2">
              <FileType className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Tipos
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2 col-span-2 sm:col-span-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Usuarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platforms">
            <PlatformsManager />
          </TabsContent>

          <TabsContent value="faculties">
            <FacultiesManager />
          </TabsContent>

          <TabsContent value="cycles">
            <CyclesManager />
          </TabsContent>

          <TabsContent value="types">
            <ResourceTypesManager />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Componente para gestionar plataformas
function PlatformsManager() {
  const [platforms, setPlatforms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_url: "",
    logo_url: "",
    is_active: true,
  })

  useEffect(() => {
    loadPlatforms()
  }, [])

  async function loadPlatforms() {
    setLoading(true)
    const data = await getPlatforms()
    setPlatforms(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addPlatform(formData)
    setFormData({ name: "", description: "", website_url: "", logo_url: "", is_active: true })
    await loadPlatforms()
  }

  async function handleToggleStatus(id: number, currentStatus: boolean) {
    await togglePlatformStatus(id, !currentStatus)
    await loadPlatforms()
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar esta plataforma? Esta acción no se puede deshacer.")) {
      await removePlatform(id)
      await loadPlatforms()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Agregar Plataforma</CardTitle>
          <CardDescription>Crea una nueva plataforma educativa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="website_url">URL del sitio web</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Activa</Label>
            </div>
            <Button type="submit" className="w-full bg-[#5D0A28] hover:bg-[#8B1538]">
              Agregar Plataforma
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Plataformas Existentes</CardTitle>
          <CardDescription>Gestiona las plataformas del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="space-y-2">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Estado: {platform.is_active ? "✓ Activa" : "✗ Inactiva"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(platform.id, platform.is_active)}
                      className={
                        platform.is_active
                          ? "text-orange-600 hover:text-orange-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      {platform.is_active ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-1" />
                          Deshabilitar
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-1" />
                          Habilitar
                        </>
                      )}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(platform.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para gestionar facultades
function FacultiesManager() {
  const [faculties, setFaculties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    is_active: true,
  })

  useEffect(() => {
    loadFaculties()
  }, [])

  async function loadFaculties() {
    setLoading(true)
    const data = await getFaculties()
    setFaculties(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addFaculty(formData)
    setFormData({ name: "", code: "", description: "", is_active: true })
    await loadFaculties()
  }

  async function handleToggleStatus(id: number, currentStatus: boolean) {
    await toggleFacultyStatus(id, !currentStatus)
    await loadFaculties()
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar esta facultad? Esta acción no se puede deshacer.")) {
      await removeFaculty(id)
      await loadFaculties()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Agregar Facultad</CardTitle>
          <CardDescription>Crea una nueva facultad</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Activa</Label>
            </div>
            <Button type="submit" className="w-full bg-[#5D0A28] hover:bg-[#8B1538]">
              Agregar Facultad
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Facultades Existentes</CardTitle>
          <CardDescription>Gestiona las facultades del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="space-y-2">
              {faculties.map((faculty) => (
                <div key={faculty.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">
                      {faculty.name} ({faculty.code})
                    </p>
                    <p className="text-sm text-gray-600">{faculty.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Estado: {faculty.is_active ? "✓ Activa" : "✗ Inactiva"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(faculty.id, faculty.is_active)}
                      className={
                        faculty.is_active
                          ? "text-orange-600 hover:text-orange-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      {faculty.is_active ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-1" />
                          Deshabilitar
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-1" />
                          Habilitar
                        </>
                      )}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(faculty.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para gestionar ciclos
function CyclesManager() {
  const [cycles, setCycles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    semester: 1,
    start_date: "",
    end_date: "",
    is_active: true,
  })

  useEffect(() => {
    loadCycles()
  }, [])

  async function loadCycles() {
    setLoading(true)
    const data = await getCycles()
    setCycles(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addCycle(formData)
    setFormData({
      name: "",
      year: new Date().getFullYear(),
      semester: 1,
      start_date: "",
      end_date: "",
      is_active: true,
    })
    await loadCycles()
  }

  async function handleToggleStatus(id: number, currentStatus: boolean) {
    await toggleCycleStatus(id, !currentStatus)
    await loadCycles()
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar este ciclo? Esta acción no se puede deshacer.")) {
      await removeCycle(id)
      await loadCycles()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Agregar Ciclo Académico</CardTitle>
          <CardDescription>Crea un nuevo ciclo académico</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre (ej: 01-2025)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="semester">Semestre</Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  max="2"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Fecha inicio</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">Fecha fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Activo</Label>
            </div>
            <Button type="submit" className="w-full bg-[#5D0A28] hover:bg-[#8B1538]">
              Agregar Ciclo
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Ciclos Existentes</CardTitle>
          <CardDescription>Gestiona los ciclos académicos</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="space-y-2">
              {cycles.map((cycle) => (
                <div key={cycle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{cycle.name}</p>
                    <p className="text-sm text-gray-600">
                      Año {cycle.year} - Semestre {cycle.semester}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Estado: {cycle.is_active ? "✓ Activo" : "✗ Inactivo"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(cycle.id, cycle.is_active)}
                      className={
                        cycle.is_active
                          ? "text-orange-600 hover:text-orange-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      {cycle.is_active ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-1" />
                          Deshabilitar
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-1" />
                          Habilitar
                        </>
                      )}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(cycle.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para gestionar tipos de recursos
function ResourceTypesManager() {
  const [types, setTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    is_active: true,
  })

  useEffect(() => {
    loadTypes()
  }, [])

  async function loadTypes() {
    setLoading(true)
    const data = await getResourceTypes()
    setTypes(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addResourceType(formData)
    setFormData({ name: "", description: "", icon: "", is_active: true })
    await loadTypes()
  }

  async function handleToggleStatus(id: number, currentStatus: boolean) {
    await toggleResourceTypeStatus(id, !currentStatus)
    await loadTypes()
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar este tipo? Esta acción no se puede deshacer.")) {
      await removeResourceType(id)
      await loadTypes()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Agregar Tipo de Recurso</CardTitle>
          <CardDescription>Crea un nuevo tipo de recurso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="icon">Icono (nombre de Lucide)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="file-text"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Activo</Label>
            </div>
            <Button type="submit" className="w-full bg-[#5D0A28] hover:bg-[#8B1538]">
              Agregar Tipo
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Tipos Existentes</CardTitle>
          <CardDescription>Gestiona los tipos de recursos</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{type.name}</p>
                    <p className="text-sm text-gray-600">{type.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Estado: {type.is_active ? "✓ Activo" : "✗ Inactivo"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(type.id, type.is_active)}
                      className={
                        type.is_active ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"
                      }
                    >
                      {type.is_active ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-1" />
                          Deshabilitar
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-1" />
                          Habilitar
                        </>
                      )}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(type.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para gestionar usuarios
function UsersManager() {
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [uploadResults, setUploadResults] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [usersData, rolesData] = await Promise.all([getAllUsers(), getAllRoles()])
    setUsers(usersData)
    setRoles(rolesData)
    setLoading(false)
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const results = await bulkUploadUsers(text)
      setUploadResults(results)
      await loadData()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  async function handleAssignRole() {
    if (!selectedUser || !selectedRole) {
      alert("Selecciona un usuario y un rol")
      return
    }
    await assignUserRole(selectedUser, Number.parseInt(selectedRole))
    alert("✅ Rol asignado correctamente")
    setSelectedUser("")
    setSelectedRole("")
    await loadData()
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Carga Masiva de Usuarios</CardTitle>
          <CardDescription>Sube un archivo CSV con el formato: username,password,email,name,role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-sm text-muted-foreground mb-2">Formato del CSV (con encabezados):</p>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              {`username,password,email,name,role
juan.perez,Pass123!,juan.perez@utec.edu.sv,Juan Pérez,docente
maria.lopez,Pass456!,maria.lopez@utec.edu.sv,María López,coordinador
carlos.rodriguez,Pass789!,carlos.rodriguez@utec.edu.sv,Carlos Rodríguez,docente`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              Roles válidos: <strong>docente</strong>, <strong>coordinador</strong>, <strong>superadmin</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-file">Seleccionar archivo CSV</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleCsvUpload} />
          </div>

          {uploadResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Resultados:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {uploadResults.map((result, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded ${
                      result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {result.success ? (
                      <span>
                        ✓ {result.username} creado con rol: {result.role}
                      </span>
                    ) : (
                      <span>
                        ✗ {result.username}: {result.error}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-[#5D0A28]">
        <CardHeader>
          <CardTitle>Asignar Roles</CardTitle>
          <CardDescription>Gestiona los roles de los usuarios (3 roles disponibles)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <div>
                <Label htmlFor="user">Usuario</Label>
                <select
                  id="user"
                  className="w-full p-2 border rounded"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} - {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="role">Rol</Label>
                <select
                  id="role"
                  className="w-full p-2 border rounded"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button onClick={handleAssignRole} className="w-full bg-[#5D0A28] hover:bg-[#8B1538]">
                Asignar Rol
              </Button>

              <div className="mt-6 space-y-2">
                <h3 className="font-semibold">Roles del Sistema:</h3>
                {roles.map((role) => (
                  <div key={role.id} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">{role.name}</p>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-[#5D0A28] md:col-span-2">
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>Total: {users.length} usuarios registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="p-3 bg-gray-50 rounded">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.name}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para gestionar roles
function RolesManager() {
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRole, setSelectedRole] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [usersData, rolesData] = await Promise.all([getAllUsers(), getAllRoles()])
    setUsers(usersData)
    setRoles(rolesData)
    setLoading(false)
  }

  async function handleAssignRole() {
    if (!selectedUser || !selectedRole) {
      alert("Selecciona un usuario y un rol")
      return
    }
    await assignUserRole(selectedUser, Number.parseInt(selectedRole))
    alert("Rol asignado correctamente")
    setSelectedUser("")
    setSelectedRole("")
  }

  return (
    <Card className="border-t-4 border-t-[#5D0A28]">
      <CardHeader>
        <CardTitle>Asignar Roles a Usuarios</CardTitle>
        <CardDescription>Gestiona los roles de los usuarios del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <div>
              <Label htmlFor="user">Usuario</Label>
              <select
                id="user"
                className="w-full p-2 border rounded"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Selecciona un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} - {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                className="w-full p-2 border rounded"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Selecciona un rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={handleAssignRole} className="w-full bg-[#5D0A28] hover:bg-[#8B1538]">
              Asignar Rol
            </Button>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Roles Disponibles:</h3>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.id} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">{role.name}</p>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
