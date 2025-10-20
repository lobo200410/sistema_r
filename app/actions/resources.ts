"use server"

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { createResource, getResources, updateResource, deleteResource, getAllResourcesFromDB } from "@/lib/resources"
import { isSuperAdmin, isCoordinador } from "@/lib/admin"
import type { Resource } from "@/lib/resources"

export async function getUserResources(): Promise<Resource[]> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return getResources(user.id)
}

export async function getAllResources(): Promise<Resource[]> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return getAllResourcesFromDB()
}

export async function createNewResource(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const titulo = formData.get("titulo") as string
  const descripcion = formData.get("descripcion") as string
  const url = formData.get("url") as string
  const typeId = formData.get("typeId") as string
  const platformId = formData.get("platformId") as string
  const facultyId = formData.get("facultyId") as string
  const cycleId = formData.get("cycleId") as string
  const publicado = formData.get("publicado") === "true"

  const resource = await createResource({
    titulo,
    descripcion,
    url,
    typeId: Number.parseInt(typeId),
    platformId: Number.parseInt(platformId),
    facultyId: Number.parseInt(facultyId),
    cycleId: Number.parseInt(cycleId),
    publicado,
    userId: user.id,
  })

  return { success: true, resource }
}

export async function updateExistingResource(id: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const titulo = formData.get("titulo") as string
  const descripcion = formData.get("descripcion") as string
  const url = formData.get("url") as string
  const typeId = formData.get("typeId") as string
  const platformId = formData.get("platformId") as string
  const facultyId = formData.get("facultyId") as string
  const cycleId = formData.get("cycleId") as string
  const publicado = formData.get("publicado") === "true"

  const result = await updateResource(id, user.id, {
    titulo,
    descripcion,
    url,
    typeId: Number.parseInt(typeId),
    platformId: Number.parseInt(platformId),
    facultyId: Number.parseInt(facultyId),
    cycleId: Number.parseInt(cycleId),
    publicado,
  })

  if (!result) {
    return { error: "Recurso no encontrado" }
  }

  return { success: true }
}

export async function deleteExistingResource(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Verificar si el usuario es coordinador o superadmin
  const isCoord = await isCoordinador(user.id)
  const isSuper = await isSuperAdmin(user.id)

  if (!isCoord && !isSuper) {
    return { error: "No tienes permisos para eliminar recursos" }
  }

  const result = await deleteResource(id, user.id)

  if (!result) {
    return { error: "Recurso no encontrado" }
  }

  return { success: true }
}
