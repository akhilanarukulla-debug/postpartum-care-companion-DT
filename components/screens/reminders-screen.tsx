"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { ReminderCard } from "@/components/reminder-card"

interface Reminder {
  id: string
  title: string
  time: string
  type: "medication" | "self-care" | "appointment" | "hydration"
  completed: boolean
}

interface RemindersScreenProps {
  reminders: Reminder[]
  onUpdateReminders: (reminders: Reminder[]) => void
}

export function RemindersScreen({ reminders, onUpdateReminders }: RemindersScreenProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "",
    type: "self-care" as const,
  })

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    )
    onUpdateReminders(updated)
  }

  const addReminder = () => {
    if (newReminder.title && newReminder.time) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        ...newReminder,
        completed: false,
      }
      onUpdateReminders([...reminders, reminder])
      setNewReminder({ title: "", time: "", type: "self-care" })
      setShowAddForm(false)
    }
  }

  const activeReminders = reminders.filter((r) => !r.completed)
  const completedReminders = reminders.filter((r) => r.completed)

  return (
    <div className="min-h-screen pb-24 px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <header className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Reminders
        </h1>
        <p className="text-muted-foreground">
          Gentle nudges to take care of yourself
        </p>
      </header>

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="mb-6 p-5 bg-card rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">New reminder</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close form"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Reminder title"
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              className="w-full px-4 py-3 bg-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D6D4F0]"
            />
            <input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              className="w-full px-4 py-3 bg-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#D6D4F0]"
            />
            <select
              value={newReminder.type}
              onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as Reminder["type"] })}
              className="w-full px-4 py-3 bg-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#D6D4F0]"
            >
              <option value="self-care">Self-care</option>
              <option value="medication">Medication</option>
              <option value="appointment">Appointment</option>
              <option value="hydration">Hydration</option>
            </select>
            <button
              onClick={addReminder}
              disabled={!newReminder.title || !newReminder.time}
              className="w-full py-3 bg-[#E8CFCF] text-[#5A4545] rounded-xl font-medium hover:bg-[#E0C5C5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Reminder
            </button>
          </div>
        </div>
      )}

      {/* Active Reminders */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          Upcoming ({activeReminders.length})
        </h2>
        <div className="space-y-3">
          {activeReminders.map((reminder, index) => (
            <div
              key={reminder.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ReminderCard
                title={reminder.title}
                time={reminder.time}
                type={reminder.type}
                isCompleted={reminder.completed}
                onToggle={() => toggleReminder(reminder.id)}
              />
            </div>
          ))}
          {activeReminders.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No upcoming reminders. Add one to stay on track!
            </p>
          )}
        </div>
      </section>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Completed ({completedReminders.length})
          </h2>
          <div className="space-y-3">
            {completedReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                title={reminder.title}
                time={reminder.time}
                type={reminder.type}
                isCompleted={reminder.completed}
                onToggle={() => toggleReminder(reminder.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Floating Add Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-[#E8CFCF] rounded-full shadow-lg flex items-center justify-center hover:bg-[#E0C5C5] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0] animate-in fade-in zoom-in-95 duration-300"
          aria-label="Add new reminder"
        >
          <Plus className="w-6 h-6 text-[#5A4545]" />
        </button>
      )}
    </div>
  )
}
