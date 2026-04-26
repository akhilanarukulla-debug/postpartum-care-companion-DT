"use client"

import { useState } from "react"
import { Plus, X, Bell, CheckCircle2 } from "lucide-react"
import { ReminderCard } from "@/components/reminder-card"
import { SectionHeader } from "@/components/section-header"
import { EmptyState } from "@/components/empty-state"
import { InsightCard } from "@/components/insight-card"

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
  const completedToday = completedReminders.length

  return (
    <div className="min-h-screen pb-24 px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <header className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Reminders
        </h1>
        <p className="text-muted-foreground">
          Gentle nudges to take care of yourself
        </p>
      </header>

      {/* Completed Today Insight */}
      {completedToday > 0 && (
        <section className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-50">
          <InsightCard 
            type="general" 
            message={`You&apos;ve completed ${completedToday} reminder${completedToday !== 1 ? 's' : ''} today. Keep up the great work!`} 
          />
        </section>
      )}

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="mb-6 p-5 bg-card rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">New reminder</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 rounded-lg hover:bg-muted tap-scale transition-all duration-150"
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
              className="w-full px-4 py-3 bg-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] transition-all duration-200"
            />
            <input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              className="w-full px-4 py-3 bg-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] transition-all duration-200"
            />
            <select
              value={newReminder.type}
              onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as Reminder["type"] })}
              className="w-full px-4 py-3 bg-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] transition-all duration-200"
            >
              <option value="self-care">Self-care</option>
              <option value="medication">Medication</option>
              <option value="appointment">Appointment</option>
              <option value="hydration">Hydration</option>
            </select>
            <button
              onClick={addReminder}
              disabled={!newReminder.title || !newReminder.time}
              className="w-full py-3 bg-[#E8CFCF] text-[#5A4545] rounded-xl font-medium hover:bg-[#E0C5C5] tap-scale transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Reminder
            </button>
          </div>
        </div>
      )}

      {/* Active Reminders */}
      <section className="mb-8">
        <SectionHeader 
          title="Upcoming" 
          subtitle={activeReminders.length > 0 ? `${activeReminders.length} reminder${activeReminders.length !== 1 ? 's' : ''}` : undefined}
        />
        
        {activeReminders.length > 0 ? (
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
          </div>
        ) : (
          <EmptyState
            icon={<Bell className="w-6 h-6" />}
            title="No upcoming reminders"
            description="Create gentle reminders to help you take care of yourself throughout the day."
            variant="pink"
            action={{
              label: "Add Reminder",
              onClick: () => setShowAddForm(true),
            }}
          />
        )}
      </section>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <section>
          <SectionHeader 
            title="Completed" 
            subtitle={`${completedReminders.length} done today`}
          />
          <div className="space-y-3">
            {completedReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="animate-in fade-in duration-200"
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
          </div>
        </section>
      )}

      {/* Floating Add Button */}
      {!showAddForm && activeReminders.length > 0 && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-[#E8CFCF] rounded-full shadow-lg flex items-center justify-center hover:bg-[#E0C5C5] tap-scale transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0] animate-in fade-in zoom-in-95 duration-300"
          aria-label="Add new reminder"
        >
          <Plus className="w-6 h-6 text-[#5A4545]" />
        </button>
      )}
    </div>
  )
}
