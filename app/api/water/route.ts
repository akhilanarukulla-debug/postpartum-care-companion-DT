import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { getTodayWaterEntry, updateWaterEntry, getWaterHistory } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const history = searchParams.get("history") === "true"

    if (history) {
      const data = await getWaterHistory(user.id, 7)
      return NextResponse.json(data)
    }

    const todayEntry = await getTodayWaterEntry(user.id)
    return NextResponse.json({ glasses: todayEntry?.glasses || 0 })
  } catch (error) {
    console.error("Water API GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] Water API POST: Starting request")
    const user = await getAuthenticatedUser()

    if (!user) {
      console.log("[v0] Water API POST: Unauthorized - no user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Water API POST: User authenticated:", user.id)
    const body = await request.json()
    const { glasses } = body
    console.log("[v0] Water API POST: Received glasses:", glasses)

    if (typeof glasses !== "number" || glasses < 0) {
      console.log("[v0] Water API POST: Invalid glasses value")
      return NextResponse.json(
        { error: "Valid glasses count is required" },
        { status: 400 }
      )
    }

    console.log("[v0] Water API POST: Calling updateWaterEntry for user:", user.id, "glasses:", glasses)
    const entry = await updateWaterEntry(user.id, glasses)
    console.log("[v0] Water API POST: Entry saved:", entry)
    return NextResponse.json(entry)
  } catch (error) {
    console.error("[v0] Water API POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
