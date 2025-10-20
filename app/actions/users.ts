"use server"

import { getUser } from "./auth"
import { isSuperAdmin } from "@/lib/admin"
import { query, queryOne } from "@/lib/db"

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

export interface UserWithRole {
  id: string
  username: string
  email: string
  name: string
  is_active: boolean
  created_at: string
  role_name: string | null
  role_id: number | null
}

// Buscar usuarios por nombre o username
export async function searchUsers(searchTerm: string): Promise<UserWithRole[]> {
  await verifySuperAdmin()

  const users = await query<UserWithRole>(
    `SELECT 
      u.id, 
      u.username, 
      u.email, 
      u.name, 
      u.is_active, 
      u.created_at,
      (SELECT r.name FROM user_roles ur 
       JOIN roles r ON ur.role_id = r.id 
       WHERE ur.user_id = u.id 
       LIMIT 1) as role_name,
      (SELECT r.id FROM user_roles ur 
       JOIN roles r ON ur.role_id = r.id 
       WHERE ur.user_id = u.id 
       LIMIT 1) as role_id
    FROM users u
    WHERE u.username LIKE ? OR u.name LIKE ?
    ORDER BY u.created_at DESC`,
    [`%${searchTerm}%`, `%${searchTerm}%`],
  )

  console.log("[v0] searchUsers results:", users.length, "users found")
  console.log(
    "[v0] User IDs:",
    users.map((u) => u.id),
  )

  return users
}

// Obtener todos los usuarios con sus roles
export async function getAllUsersWithRoles(): Promise<UserWithRole[]> {
  await verifySuperAdmin()

  const users = await query<UserWithRole>(
    `SELECT 
      u.id, 
      u.username, 
      u.email, 
      u.name, 
      u.is_active, 
      u.created_at,
      (SELECT r.name FROM user_roles ur 
       JOIN roles r ON ur.role_id = r.id 
       WHERE ur.user_id = u.id 
       LIMIT 1) as role_name,
      (SELECT r.id FROM user_roles ur 
       JOIN roles r ON ur.role_id = r.id 
       WHERE ur.user_id = u.id 
       LIMIT 1) as role_id
    FROM users u
    ORDER BY u.created_at DESC`,
  )

  console.log("[v0] getAllUsersWithRoles results:", users.length, "users found")
  console.log(
    "[v0] User IDs:",
    users.map((u) => u.id),
  )

  return users
}

// Obtener un usuario específico con su rol
export async function getUserById(userId: string): Promise<UserWithRole | null> {
  await verifySuperAdmin()

  const user = await queryOne<UserWithRole>(
    `SELECT 
      u.id, 
      u.username, 
      u.email, 
      u.name, 
      u.is_active, 
      u.created_at,
      r.name as role_name,
      r.id as role_id
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.id = ?`,
    [userId],
  )

  return user
}

// Actualizar información del usuario
export async function updateUser(
  userId: string,
  data: {
    email?: string
    name?: string
    username?: string
    is_active?: boolean
  },
) {
  await verifySuperAdmin()

  const fields: string[] = []
  const values: any[] = []

  if (data.email !== undefined) {
    fields.push("email = ?")
    values.push(data.email)
  }
  if (data.name !== undefined) {
    fields.push("name = ?")
    values.push(data.name)
  }
  if (data.username !== undefined) {
    fields.push("username = ?")
    values.push(data.username)
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?")
    values.push(data.is_active)
  }

  if (fields.length > 0) {
    values.push(userId)
    await query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values)
  }
}

// Cambiar contraseña del usuario
export async function updateUserPassword(userId: string, newPassword: string) {
  await verifySuperAdmin()

  // En producción, deberías usar bcrypt para hashear la contraseña
  await query("UPDATE users SET password = ? WHERE id = ?", [newPassword, userId])
}

// Actualizar rol del usuario
export async function updateUserRole(userId: string, roleId: number) {
  await verifySuperAdmin()

  // Eliminar roles existentes
  await query("DELETE FROM user_roles WHERE user_id = ?", [userId])

  // Asignar nuevo rol
  await query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [userId, roleId])
}

// Obtener todos los roles disponibles
export async function getAllRolesForSelect() {
  await verifySuperAdmin()

  return await query<{ id: number; name: string; description: string }>(
    "SELECT id, name, description FROM roles ORDER BY name",
  )
}

// Eliminar usuario (soft delete)
export async function deleteUser(userId: string) {
  await verifySuperAdmin()

  await query("UPDATE users SET deleted_at = NOW(), is_active = FALSE WHERE id = ?", [userId])
}

// Activar/desactivar usuario
export async function toggleUserStatus(userId: string, isActive: boolean) {
  await verifySuperAdmin()

  await query("UPDATE users SET is_active = ? WHERE id = ?", [isActive, userId])
}
