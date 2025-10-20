import { query, queryOne } from "./db"

export interface User {
  id: string
  email: string
  username: string
  name: string
  password: string
}

export interface SessionData {
  user: Omit<User, "password">
  expiresAt: string
}

export async function createUser(
  username: string,
  password: string,
  email?: string,
  name?: string,
): Promise<Omit<User, "password">> {
  const id = crypto.randomUUID()
  const userEmail = email || `${username}@utec.edu.sv`
  const userName = name || username

  const existingUser = await queryOne<User>("SELECT id, email, username, name FROM users WHERE username = ?", [
    username,
  ])

  if (existingUser) {
    return existingUser
  }

  await query("INSERT INTO users (id, email, username, name, password) VALUES (?, ?, ?, ?, ?)", [
    id,
    userEmail,
    username,
    userName,
    password,
  ])

  return { id, email: userEmail, username, name: userName }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return await queryOne<User>("SELECT id, email, username, name, password FROM users WHERE username = ?", [username])
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await queryOne<User>("SELECT id, email, username, name FROM users WHERE email = ?", [email])
}

export async function createSession(user: Omit<User, "password">): Promise<SessionData> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await query("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)", [sessionId, user.id, expiresAt])

  return {
    user,
    expiresAt: expiresAt.toISOString(),
  }
}

export function isSessionValid(session: SessionData): boolean {
  return new Date(session.expiresAt) > new Date()
}
