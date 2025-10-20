import { query, queryOne } from "./db"
import crypto from "crypto"

export interface Resource {
  id: string
  titulo: string
  descripcion?: string
  url: string
  tipo: string
  ciclo: string
  publicado: boolean
  facultad: string
  plataforma: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export async function createResource(data: {
  titulo: string
  descripcion?: string
  url: string
  typeId: number
  platformId: number
  facultyId: number
  cycleId: number
  publicado: boolean
  userId: string
}): Promise<Resource> {
  const id = crypto.randomUUID()

  await query(
    `INSERT INTO resources (id, titulo, descripcion, url, type_id, platform_id, faculty_id, cycle_id, publicado, user_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.titulo,
      data.descripcion || "",
      data.url,
      data.typeId ?? null,
      data.platformId ?? null,
      data.facultyId ?? null,
      data.cycleId ?? null,
      data.publicado,
      data.userId,
    ],
  )

  // Fetch the created resource with JOINs to get the names
  const resource = await queryOne<any>(
    `SELECT 
      r.id, r.titulo, r.descripcion, r.url,
      rt.name as tipo,
      p.name as plataforma,
      f.name as facultad,
      ac.name as ciclo,
      r.publicado, r.user_id as userId, r.created_at as createdAt, r.updated_at as updatedAt
    FROM resources r
    LEFT JOIN resource_types rt ON r.type_id = rt.id
    LEFT JOIN platforms p ON r.platform_id = p.id
    LEFT JOIN faculties f ON r.faculty_id = f.id
    LEFT JOIN academic_cycles ac ON r.cycle_id = ac.id
    WHERE r.id = ?`,
    [id],
  )

  return {
    ...resource,
    publicado: Boolean(resource.publicado),
    createdAt: new Date(resource.createdAt),
    updatedAt: new Date(resource.updatedAt),
  }
}

export async function getResources(userId: string): Promise<Resource[]> {
  const resources = await query<any>(
    `SELECT 
      r.id, r.titulo, r.descripcion, r.url,
      rt.name as tipo,
      p.name as plataforma,
      f.name as facultad,
      ac.name as ciclo,
      r.publicado, r.user_id as userId, r.created_at as createdAt, r.updated_at as updatedAt
    FROM resources r
    LEFT JOIN resource_types rt ON r.type_id = rt.id
    LEFT JOIN platforms p ON r.platform_id = p.id
    LEFT JOIN faculties f ON r.faculty_id = f.id
    LEFT JOIN academic_cycles ac ON r.cycle_id = ac.id
    WHERE r.user_id = ? AND r.deleted_at IS NULL
    ORDER BY r.created_at DESC`,
    [userId],
  )

  return resources.map((r) => ({
    ...r,
    publicado: Boolean(r.publicado),
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
  }))
}

export async function getResource(id: string, userId: string): Promise<Resource | null> {
  const resource = await queryOne<any>(
    `SELECT 
      r.id, r.titulo, r.descripcion, r.url,
      rt.name as tipo,
      p.name as plataforma,
      f.name as facultad,
      ac.name as ciclo,
      r.publicado, r.user_id as userId, r.created_at as createdAt, r.updated_at as updatedAt
    FROM resources r
    LEFT JOIN resource_types rt ON r.type_id = rt.id
    LEFT JOIN platforms p ON r.platform_id = p.id
    LEFT JOIN faculties f ON r.faculty_id = f.id
    LEFT JOIN academic_cycles ac ON r.cycle_id = ac.id
    WHERE r.id = ? AND r.user_id = ? AND r.deleted_at IS NULL`,
    [id, userId],
  )

  if (!resource) return null

  return {
    ...resource,
    publicado: Boolean(resource.publicado),
    createdAt: new Date(resource.createdAt),
    updatedAt: new Date(resource.updatedAt),
  }
}

export async function updateResource(
  id: string,
  userId: string,
  data: {
    titulo?: string
    descripcion?: string
    url?: string
    typeId?: number
    platformId?: number
    facultyId?: number
    cycleId?: number
    publicado?: boolean
  },
): Promise<Resource | null> {
  const fields: string[] = []
  const values: any[] = []

  if (data.titulo !== undefined) {
    fields.push("titulo = ?")
    values.push(data.titulo)
  }
  if (data.descripcion !== undefined) {
    fields.push("descripcion = ?")
    values.push(data.descripcion)
  }
  if (data.url !== undefined) {
    fields.push("url = ?")
    values.push(data.url)
  }
  if (data.typeId !== undefined) {
    fields.push("type_id = ?")
    values.push(data.typeId ?? null)
  }
  if (data.platformId !== undefined) {
    fields.push("platform_id = ?")
    values.push(data.platformId ?? null)
  }
  if (data.facultyId !== undefined) {
    fields.push("faculty_id = ?")
    values.push(data.facultyId ?? null)
  }
  if (data.cycleId !== undefined) {
    fields.push("cycle_id = ?")
    values.push(data.cycleId ?? null)
  }
  if (data.publicado !== undefined) {
    fields.push("publicado = ?")
    values.push(data.publicado)
  }

  if (fields.length === 0) return null

  values.push(id, userId)

  await query(
    `UPDATE resources SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
    values,
  )

  return getResource(id, userId)
}

export async function deleteResource(id: string, userId: string): Promise<boolean> {
  const result = await query("UPDATE resources SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?", [
    id,
    userId,
  ])

  return (result as any).affectedRows > 0
}

export async function getAllResourcesFromDB(): Promise<Resource[]> {
  const resources = await query<any>(
    `SELECT 
      r.id, r.titulo, r.descripcion, r.url,
      rt.name as tipo,
      p.name as plataforma,
      f.name as facultad,
      ac.name as ciclo,
      r.publicado, r.user_id as userId, r.created_at as createdAt, r.updated_at as updatedAt
    FROM resources r
    LEFT JOIN resource_types rt ON r.type_id = rt.id
    LEFT JOIN platforms p ON r.platform_id = p.id
    LEFT JOIN faculties f ON r.faculty_id = f.id
    LEFT JOIN academic_cycles ac ON r.cycle_id = ac.id
    WHERE r.deleted_at IS NULL
    ORDER BY r.created_at DESC`,
  )

  return resources.map((r) => ({
    ...r,
    publicado: Boolean(r.publicado),
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
  }))
}
