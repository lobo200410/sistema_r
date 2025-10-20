"use server"
import { getUser } from "./auth"
import {
  getAllPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
  getAllFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAllCycles,
  createCycle,
  updateCycle,
  deleteCycle,
  getAllResourceTypes,
  createResourceType,
  updateResourceType,
  deleteResourceType,
  isSuperAdmin,
  isCoordinador,
  type Platform,
  type Faculty,
  type AcademicCycle,
  type ResourceType,
} from "@/lib/admin"
import { query } from "@/lib/db"
import { createUser } from "@/lib/auth"

// Verificar si el usuario es superadmin
async function verifySuperAdmin() {
  const user = await getUser()
  if (!user) {
    throw new Error("No autenticado")
  }

  const isAdmin = await isSuperAdmin(user.id)
  if (!isAdmin) {
    throw new Error("No tienes permisos de superadmin")
  }

  return user
}

export async function getPublicPlatforms() {
  const user = await getUser()
  if (!user) {
    throw new Error("No autenticado")
  }
  return await getAllPlatforms()
}

export async function getPublicFaculties() {
  const user = await getUser()
  if (!user) {
    throw new Error("No autenticado")
  }
  return await getAllFaculties()
}

export async function getPublicCycles() {
  const user = await getUser()
  if (!user) {
    throw new Error("No autenticado")
  }
  return await getAllCycles()
}

export async function getPublicResourceTypes() {
  const user = await getUser()
  if (!user) {
    throw new Error("No autenticado")
  }
  return await getAllResourceTypes()
}

// Plataformas (solo superadmin puede administrar)
export async function getPlatforms() {
  await verifySuperAdmin()
  return await getAllPlatforms()
}

export async function addPlatform(data: Omit<Platform, "id" | "created_at" | "updated_at">) {
  await verifySuperAdmin()
  await createPlatform(data)
}

export async function editPlatform(id: number, data: Partial<Platform>) {
  await verifySuperAdmin()
  await updatePlatform(id, data)
}

export async function removePlatform(id: number) {
  await verifySuperAdmin()
  await deletePlatform(id)
}

// Función para toggle de is_active en plataformas
export async function togglePlatformStatus(id: number, isActive: boolean) {
  await verifySuperAdmin()
  await updatePlatform(id, { is_active: isActive })
}

// Facultades
export async function getFaculties() {
  await verifySuperAdmin()
  return await getAllFaculties()
}

export async function addFaculty(data: Omit<Faculty, "id" | "created_at" | "updated_at">) {
  await verifySuperAdmin()
  await createFaculty(data)
}

export async function editFaculty(id: number, data: Partial<Faculty>) {
  await verifySuperAdmin()
  await updateFaculty(id, data)
}

export async function removeFaculty(id: number) {
  await verifySuperAdmin()
  await deleteFaculty(id)
}

// Función para toggle de is_active en facultades
export async function toggleFacultyStatus(id: number, isActive: boolean) {
  await verifySuperAdmin()
  await updateFaculty(id, { is_active: isActive })
}

// Ciclos
export async function getCycles() {
  await verifySuperAdmin()
  return await getAllCycles()
}

export async function addCycle(data: Omit<AcademicCycle, "id" | "created_at" | "updated_at">) {
  await verifySuperAdmin()
  await createCycle(data)
}

export async function editCycle(id: number, data: Partial<AcademicCycle>) {
  await verifySuperAdmin()
  await updateCycle(id, data)
}

export async function removeCycle(id: number) {
  await verifySuperAdmin()
  await deleteCycle(id)
}

// Función para toggle de is_active en ciclos
export async function toggleCycleStatus(id: number, isActive: boolean) {
  await verifySuperAdmin()
  await updateCycle(id, { is_active: isActive })
}

// Tipos de recursos
export async function getResourceTypes() {
  await verifySuperAdmin()
  return await getAllResourceTypes()
}

export async function addResourceType(data: Omit<ResourceType, "id" | "created_at" | "updated_at">) {
  await verifySuperAdmin()
  await createResourceType(data)
}

export async function editResourceType(id: number, data: Partial<ResourceType>) {
  await verifySuperAdmin()
  await updateResourceType(id, data)
}

export async function removeResourceType(id: number) {
  await verifySuperAdmin()
  await deleteResourceType(id)
}

// Función para toggle de is_active en tipos de recursos
export async function toggleResourceTypeStatus(id: number, isActive: boolean) {
  await verifySuperAdmin()
  await updateResourceType(id, { is_active: isActive })
}

// Usuarios
export async function getAllUsers() {
  await verifySuperAdmin()
  return await query<any>("SELECT id, username, email, name, created_at FROM users ORDER BY created_at DESC")
}

export async function createBulkUsers(
  users: Array<{ username: string; password: string; email?: string; name?: string }>,
) {
  await verifySuperAdmin()

  const results = []
  for (const userData of users) {
    try {
      const user = await createUser(userData.username, userData.password, userData.email, userData.name)
      results.push({ success: true, user })
    } catch (error) {
      results.push({ success: false, username: userData.username, error: String(error) })
    }
  }

  return results
}

export async function assignUserRole(userId: string, roleId: number) {
  await verifySuperAdmin()
  await query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE role_id = ?", [
    userId,
    roleId,
    roleId,
  ])
}

export async function getUserRolesData(userId: string) {
  await verifySuperAdmin()
  return await query<any>(
    `SELECT r.* FROM roles r
     INNER JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId],
  )
}

export async function getAllRoles() {
  await verifySuperAdmin()
  return await query<any>("SELECT * FROM roles ORDER BY name")
}

export async function getCurrentUserRole() {
  const user = await getUser()
  if (!user) {
    throw new Error("No autenticado")
  }

  const isSuperAdminUser = await isSuperAdmin(user.id)
  if (isSuperAdminUser) return "superadmin"

  const isCoordinadorUser = await isCoordinador(user.id)
  if (isCoordinadorUser) return "coordinador"

  return "docente"
}

// Carga masiva de usuarios con roles desde CSV
export async function bulkUploadUsers(csvContent: string) {
  const user = await getUser()
  if (!user) {
    throw new Error("No autenticado")
  }

  const isAdmin = await isSuperAdmin(user.id)
  if (!isAdmin) {
    throw new Error("No tienes permisos de superadmin")
  }

  const lines = csvContent.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  // Verificar que el CSV tenga las columnas correctas
  const requiredHeaders = ["username", "password", "email", "name", "role"]
  const hasAllHeaders = requiredHeaders.every((h) => headers.includes(h))

  if (!hasAllHeaders) {
    throw new Error(`El CSV debe tener las columnas: ${requiredHeaders.join(", ")}`)
  }

  const results = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = line.split(",").map((v) => v.trim())
    const userData: any = {}

    headers.forEach((header, index) => {
      userData[header] = values[index]
    })

    try {
      // Crear usuario
      const user = await createUser(userData.username, userData.password, userData.email, userData.name)

      // Asignar rol automáticamente
      const roleName = userData.role.toLowerCase()
      const validRoles = ["docente", "coordinador", "superadmin"]

      if (!validRoles.includes(roleName)) {
        throw new Error(`Rol inválido: ${userData.role}. Debe ser: docente, coordinador o superadmin`)
      }

      // Obtener el ID del rol
      const roleResult = (await query("SELECT id FROM roles WHERE name = ?", [roleName])) as any[]

      if (roleResult.length > 0) {
        const roleId = roleResult[0].id

        // Asignar rol al usuario
        await query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [user.id, roleId])
      }

      results.push({ success: true, username: userData.username, role: roleName })
    } catch (error: any) {
      results.push({ success: false, username: userData.username, error: error.message })
    }
  }

  return results
}
