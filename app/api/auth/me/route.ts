import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json({ user: null })
  }
}
