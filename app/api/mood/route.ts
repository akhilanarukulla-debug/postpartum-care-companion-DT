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
    console.log("[v0] Mood API POST: Starting request")
    const user = await getAuthenticatedUser()

    if (!user) {
      console.log("[v0] Mood API POST: Unauthorized - no user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Mood API POST: User authenticated:", user.id)
    const body = await request.json()
    const { mood, note } = body
    console.log("[v0] Mood API POST: Received mood:", mood, "note:", note)

    if (!mood) {
      console.log("[v0] Mood API POST: Missing mood")
      return NextResponse.json({ error: "Mood is required" }, { status: 400 })
    }

    console.log("[v0] Mood API POST: Creating mood entry for user:", user.id)
    const entry = await createMoodEntry(user.id, mood, note)
    console.log("[v0] Mood API POST: Entry created:", entry)
    return NextResponse.json(entry)
  } catch (error) {
    console.error("[v0] Mood API POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
