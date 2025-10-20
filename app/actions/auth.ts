"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createUser, createSession, getUserByUsername, type SessionData } from "@/lib/auth"

export async function register(prevState: any, formData: FormData) {
  const username = formData.get("username") as string
  const name = formData.get("name") as string
  const password = formData.get("password") as string

  if (!username || !password || !name) {
    return { error: "Todos los campos son requeridos" }
  }

  const existingUser = await getUserByUsername(username)
  if (existingUser) {
    return { error: "El nombre de usuario ya existe" }
  }

  const user = await createUser(username, password, undefined, name)
  const session = await createSession(user)

  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect("/dashboard")
}

export async function login(prevState: any, formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { error: "Usuario y contraseña son requeridos" }
  }

  const user = await getUserByUsername(username)

  if (!user) {
    return { error: "Usuario o contraseña incorrectos" }
  }

  // En producción, deberías usar bcrypt para comparar hashes
  if (user.password !== password) {
    return { error: "Usuario o contraseña incorrectos" }
  }

  const session = await createSession(user)

  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect("/dashboard")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/login")
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const session: SessionData = JSON.parse(sessionCookie.value)

    if (new Date(session.expiresAt) < new Date()) {
      cookieStore.delete("session")
      return null
    }

    return session.user
  } catch (error) {
    console.error("Error parsing session:", error)
    return null
  }
}

export const getUser = getCurrentUser
