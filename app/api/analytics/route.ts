import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { getAnalyticsData } from "@/lib/db"

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await getAnalyticsData(user.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
