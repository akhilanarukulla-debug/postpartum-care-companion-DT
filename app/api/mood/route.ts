import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { getMoodEntries, createMoodEntry, getMoodChartData } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "30")
    const chart = searchParams.get("chart") === "true"

    if (chart) {
      const data = await getMoodChartData(user.id, 7)
      return NextResponse.json(data)
    }

    const entries = await getMoodEntries(user.id, limit)
    return NextResponse.json(entries)
  } catch (error) {
    console.error("Mood API GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { mood, note } = body

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 })
    }

    const entry = await createMoodEntry(user.id, mood, note)
    return NextResponse.json(entry)
  } catch (error) {
    console.error("Mood API POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
