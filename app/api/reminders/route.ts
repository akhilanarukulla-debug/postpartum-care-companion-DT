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
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, time, type } = body

    if (!title || !time) {
      return NextResponse.json(
        { error: "Title and time are required" },
        { status: 400 }
      )
    }

    const reminder = await createReminder(
      user.id,
      title,
      time,
      type || "self-care"
    )
    return NextResponse.json(reminder)
  } catch (error) {
    console.error("Reminders API POST error:", error)
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
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Reminder ID is required" },
        { status: 400 }
      )
    }

    await deleteReminder(user.id, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reminders API DELETE error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
