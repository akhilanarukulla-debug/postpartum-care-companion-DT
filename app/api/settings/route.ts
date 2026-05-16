import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { getUserSettings, createOrUpdateUserSettings } from "@/lib/db"

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await getUserSettings(user.id)
    return NextResponse.json(settings || { water_goal: 8 })
  } catch (error) {
    console.error("Settings API GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const settings = await createOrUpdateUserSettings(user.id, body)

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings API PATCH error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
