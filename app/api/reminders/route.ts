import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import {
  getReminders,
  createReminder,
  toggleReminder,
  deleteReminder,
} from "@/lib/db"

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reminders = await getReminders(user.id)
    return NextResponse.json(reminders)
  } catch (error) {
    console.error("Reminders API GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] Reminders API POST: Starting request")
    const user = await getAuthenticatedUser()

    if (!user) {
      console.log("[v0] Reminders API POST: Unauthorized - no user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Reminders API POST: User authenticated:", user.id)
    const body = await request.json()
    const { title, time, type } = body
    console.log("[v0] Reminders API POST: Received title:", title, "time:", time, "type:", type)

    if (!title || !time) {
      console.log("[v0] Reminders API POST: Missing title or time")
      return NextResponse.json(
        { error: "Title and time are required" },
        { status: 400 }
      )
    }

    console.log("[v0] Reminders API POST: Creating reminder for user:", user.id)
    const reminder = await createReminder(
      user.id,
      title,
      time,
      type || "self-care"
    )
    console.log("[v0] Reminders API POST: Reminder created:", reminder)
    return NextResponse.json(reminder)
  } catch (error) {
    console.error("[v0] Reminders API POST error:", error)
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
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: "Reminder ID is required" },
        { status: 400 }
      )
    }

    const reminder = await toggleReminder(user.id, id)
    return NextResponse.json(reminder)
  } catch (error) {
    console.error("Reminders API PATCH error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    console.log("[v0] Reminders API DELETE: Starting request")
    const user = await getAuthenticatedUser()

    if (!user) {
      console.log("[v0] Reminders API DELETE: Unauthorized - no user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Reminders API DELETE: User authenticated:", user.id)
    
    // Try to get ID from request body first (JSON), then fall back to URL params
    let id: string | null = null
    try {
      const body = await request.json()
      id = body.id
      console.log("[v0] Reminders API DELETE: Got ID from body:", id)
    } catch {
      const { searchParams } = new URL(request.url)
      id = searchParams.get("id")
      console.log("[v0] Reminders API DELETE: Got ID from URL:", id)
    }

    if (!id) {
      console.log("[v0] Reminders API DELETE: Missing ID")
      return NextResponse.json(
        { error: "Reminder ID is required" },
        { status: 400 }
      )
    }

    console.log("[v0] Reminders API DELETE: Deleting reminder:", id)
    await deleteReminder(user.id, id)
    console.log("[v0] Reminders API DELETE: Success")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Reminders API DELETE error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
