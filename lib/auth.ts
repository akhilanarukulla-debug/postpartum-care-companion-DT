import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

let sql: any = null

function getSql() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  try {
    // Check for valid session in neon_auth schema
    const result = await getSql()`
      SELECT u.id, u.email, u.name, u."createdAt"
      FROM neon_auth.session s
      JOIN neon_auth."user" u ON s."userId" = u.id
      WHERE s.token = ${sessionToken}
        AND s."expiresAt" > NOW()
    `

    if (result.length === 0) {
      return null
    }

    return result[0]
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export async function createSession(userId: string) {
  const sessionToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await getSql()`
    INSERT INTO neon_auth.session ("userId", token, "expiresAt", "createdAt", "updatedAt")
    VALUES (${userId}, ${sessionToken}, ${expiresAt.toISOString()}, NOW(), NOW())
  `

  return { sessionToken, expiresAt }
}

export async function deleteSession(sessionToken: string) {
  await getSql()`
    DELETE FROM neon_auth.session 
    WHERE token = ${sessionToken}
  `
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const hash = await hashPassword(password)
  return hash === hashedPassword
}
