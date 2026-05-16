import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { hashPassword, createSession } from "@/lib/auth"
import { createOrUpdateUserSettings } from "@/lib/db"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM neon_auth."user" WHERE email = ${email.toLowerCase()}
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    
    // Create user in neon_auth.user
    const userResult = await sql`
      INSERT INTO neon_auth."user" (email, name, "emailVerified", "createdAt", "updatedAt")
      VALUES (${email.toLowerCase()}, ${name || "Mama"}, false, NOW(), NOW())
      RETURNING id, email, name, "createdAt"
    `

    const user = userResult[0]

    // Create account with password in neon_auth.account
    await sql`
      INSERT INTO neon_auth.account ("userId", "accountId", "providerId", password, "createdAt", "updatedAt")
      VALUES (${user.id}, ${email.toLowerCase()}, 'credential', ${hashedPassword}, NOW(), NOW())
    `

    // Create default user settings
    await createOrUpdateUserSettings(user.id, {
      water_goal: 8,
      mood_streak: 0,
      water_streak: 0,
      show_onboarding: false,
    })

    // Create session
    const { sessionToken, expiresAt } = await createSession(user.id)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
