import { query, queryOne } from "./db"
import { hash } from "bcryptjs"

// Interfaces
export interface Role {
  id: number
  name: string
  description: string
  created_at: string
}

export interface Permission {
  id: number
  name: string
  description: string
  module: string
  created_at: string
}

export interface Platform {
  id: number
  name: string
  description: string
  website_url: string
  logo_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Faculty {
  id: number
  name: string
  code: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AcademicCycle {
  id: number
  name: string
  year: number
  semester: number
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ResourceType {
  id: number
  name: string
  description: string
  icon: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Funciones de roles
export async function getUserRoles(userId: string): Promise<Role[]> {
  return await query<Role>(
    `SELECT r.* FROM roles r
     INNER JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId],
  )
}

export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM permissions p
     INNER JOIN role_permissions rp ON p.id = rp.permission_id
     INNER JOIN user_roles ur ON rp.role_id = ur.role_id
     WHERE ur.user_id = ? AND p.name = ?`,
    [userId, permissionName],
  )
  return (result?.count || 0) > 0
}

export async function isSuperAdmin(userId: string): Promise<boolean> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM user_roles ur
     INNER JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = 'superadmin'`,
    [userId],
  )
  return (result?.count || 0) > 0
}

export async function isCoordinador(userId: string): Promise<boolean> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM user_roles ur
     INNER JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = 'coordinador'`,
    [userId],
  )
  return (result?.count || 0) > 0
}

export async function isDocente(userId: string): Promise<boolean> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM user_roles ur
     INNER JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = 'docente'`,
    [userId],
  )
  return (result?.count || 0) > 0
}

// Funciones de plataformas
export async function getAllPlatforms(): Promise<Platform[]> {
  return await query<Platform>("SELECT * FROM platforms ORDER BY name")
}

export async function createPlatform(data: Omit<Platform, "id" | "created_at" | "updated_at">): Promise<void> {
  await query("INSERT INTO platforms (name, description, website_url, logo_url, is_active) VALUES (?, ?, ?, ?, ?)", [
    data.name,
    data.description,
    data.website_url,
    data.logo_url,
    data.is_active,
  ])
}

export async function updatePlatform(id: number, data: Partial<Platform>): Promise<void> {
  const fields: string[] = []
  const values: any[] = []

  if (data.name !== undefined) {
    fields.push("name = ?")
    values.push(data.name)
  }
  if (data.description !== undefined) {
    fields.push("description = ?")
    values.push(data.description)
  }
  if (data.website_url !== undefined) {
    fields.push("website_url = ?")
    values.push(data.website_url)
  }
  if (data.logo_url !== undefined) {
    fields.push("logo_url = ?")
    values.push(data.logo_url)
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?")
    values.push(data.is_active)
  }

  if (fields.length > 0) {
    values.push(id)
    await query(`UPDATE platforms SET ${fields.join(", ")} WHERE id = ?`, values)
  }
}

export async function deletePlatform(id: number): Promise<void> {
  await query("DELETE FROM platforms WHERE id = ?", [id])
}

// Funciones de facultades
export async function getAllFaculties(): Promise<Faculty[]> {
  return await query<Faculty>("SELECT * FROM faculties ORDER BY name")
}

export async function createFaculty(data: Omit<Faculty, "id" | "created_at" | "updated_at">): Promise<void> {
  await query("INSERT INTO faculties (name, code, description, is_active) VALUES (?, ?, ?, ?)", [
    data.name,
    data.code,
    data.description,
    data.is_active,
  ])
}

export async function updateFaculty(id: number, data: Partial<Faculty>): Promise<void> {
  const fields: string[] = []
  const values: any[] = []

  if (data.name !== undefined) {
    fields.push("name = ?")
    values.push(data.name)
  }
  if (data.code !== undefined) {
    fields.push("code = ?")
    values.push(data.code)
  }
  if (data.description !== undefined) {
    fields.push("description = ?")
    values.push(data.description)
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?")
    values.push(data.is_active)
  }

  if (fields.length > 0) {
    values.push(id)
    await query(`UPDATE faculties SET ${fields.join(", ")} WHERE id = ?`, values)
  }
}

export async function deleteFaculty(id: number): Promise<void> {
  await query("DELETE FROM faculties WHERE id = ?", [id])
}

// Funciones de ciclos académicos
export async function getAllCycles(): Promise<AcademicCycle[]> {
  return await query<AcademicCycle>("SELECT * FROM academic_cycles ORDER BY year DESC, semester DESC")
}

export async function createCycle(data: Omit<AcademicCycle, "id" | "created_at" | "updated_at">): Promise<void> {
  await query(
    "INSERT INTO academic_cycles (name, year, semester, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?)",
    [data.name, data.year, data.semester, data.start_date, data.end_date, data.is_active],
  )
}

export async function updateCycle(id: number, data: Partial<AcademicCycle>): Promise<void> {
  const fields: string[] = []
  const values: any[] = []

  if (data.name !== undefined) {
    fields.push("name = ?")
    values.push(data.name)
  }
  if (data.year !== undefined) {
    fields.push("year = ?")
    values.push(data.year)
  }
  if (data.semester !== undefined) {
    fields.push("semester = ?")
    values.push(data.semester)
  }
  if (data.start_date !== undefined) {
    fields.push("start_date = ?")
    values.push(data.start_date)
  }
  if (data.end_date !== undefined) {
    fields.push("end_date = ?")
    values.push(data.end_date)
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?")
    values.push(data.is_active)
  }

  if (fields.length > 0) {
    values.push(id)
    await query(`UPDATE academic_cycles SET ${fields.join(", ")} WHERE id = ?`, values)
  }
}

export async function deleteCycle(id: number): Promise<void> {
  await query("DELETE FROM academic_cycles WHERE id = ?", [id])
}

// Funciones de tipos de recursos
export async function getAllResourceTypes(): Promise<ResourceType[]> {
  return await query<ResourceType>("SELECT * FROM resource_types ORDER BY name")
}

export async function createResourceType(data: Omit<ResourceType, "id" | "created_at" | "updated_at">): Promise<void> {
  await query("INSERT INTO resource_types (name, description, icon, is_active) VALUES (?, ?, ?, ?)", [
    data.name,
    data.description,
    data.icon,
    data.is_active,
  ])
}

export async function updateResourceType(id: number, data: Partial<ResourceType>): Promise<void> {
  const fields: string[] = []
  const values: any[] = []

  if (data.name !== undefined) {
    fields.push("name = ?")
    values.push(data.name)
  }
  if (data.description !== undefined) {
    fields.push("description = ?")
    values.push(data.description)
  }
  if (data.icon !== undefined) {
    fields.push("icon = ?")
    values.push(data.icon)
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?")
    values.push(data.is_active)
  }

  if (fields.length > 0) {
    values.push(id)
    await query(`UPDATE resource_types SET ${fields.join(", ")} WHERE id = ?`, values)
  }
}

export async function deleteResourceType(id: number): Promise<void> {
  await query("DELETE FROM resource_types WHERE id = ?", [id])
}

export async function getAllUsersFromDB(): Promise<any[]> {
  return await query<any>(`SELECT id, username, email, name, created_at FROM users ORDER BY created_at DESC`)
}

export async function getAllRolesFromDB(): Promise<Role[]> {
  return await query<Role>(`SELECT * FROM roles ORDER BY id`)
}

export async function assignRoleToUser(userId: string, roleId: number): Promise<void> {
  // Primero eliminar roles existentes
  await query(`DELETE FROM user_roles WHERE user_id = ?`, [userId])
  // Asignar nuevo rol
  await query(`INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`, [userId, roleId])
}

export async function createBulkUsersInDB(
  users: Array<{ username: string; password: string; email: string; name: string }>,
): Promise<Array<{ success: boolean; username: string; error?: string }>> {
  const results = []

  for (const user of users) {
    try {
      const hashedPassword = await hash(user.password, 10)
      await query(`INSERT INTO users (id, username, password, email, name) VALUES (UUID(), ?, ?, ?, ?)`, [
        user.username,
        hashedPassword,
        user.email,
        user.name,
      ])
      results.push({ success: true, username: user.username })
    } catch (error: any) {
      results.push({ success: false, username: user.username, error: error.message })
    }
  }

  return results
}
