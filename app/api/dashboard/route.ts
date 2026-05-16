import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { getDashboardData } from "@/lib/db"

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await getDashboardData(user.id)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
