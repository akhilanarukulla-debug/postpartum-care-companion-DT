import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { verifyPassword, createSession } from "@/lib/auth"

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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user and their credential account
    const result = await getSql()`
      SELECT u.id, u.email, u.name, a.password
      FROM neon_auth."user" u
      JOIN neon_auth.account a ON a."userId" = u.id
      WHERE u.email = ${email.toLowerCase()}
        AND a."providerId" = 'credential'
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const user = result[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create session
    const { sessionToken, expiresAt } = await createSession(user.id)

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    // Set session cookie in response headers
    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
