"use client"

import { MoodHistoryItem, type MoodHistoryEntry } from "@/components/mood-history-item"
import { SectionHeader } from "@/components/section-header"
import { EmptyState } from "@/components/empty-state"
import { History } from "lucide-react"

interface MoodHistoryProps {
  entries: MoodHistoryEntry[]
  maxItems?: number
  showViewAll?: boolean
  onViewAll?: () => void
}

export function MoodHistory({ 
  entries, 
  maxItems, 
  showViewAll = false,
  onViewAll 
}: MoodHistoryProps) {
  const displayEntries = maxItems ? entries.slice(0, maxItems) : entries
  const hasMore = maxItems ? entries.length > maxItems : false

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<History className="w-6 h-6" />}
        title="No mood entries yet"
        description="Start tracking your mood to see your history here. Your journey begins with a single check-in."
        variant="lavender"
      />
    )
  }

  return (
    <div className="space-y-4">
      <SectionHeader 
        title="Mood History" 
        subtitle="Your recent check-ins"
        action={showViewAll && hasMore ? (
          <button 
            onClick={onViewAll}
            className="text-sm text-[#4A4860] font-medium hover:underline transition-all duration-150"
          >
            View all
          </button>
        ) : undefined}
      />

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        {displayEntries.map((entry, index) => (
          <div 
            key={entry.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MoodHistoryItem entry={entry} />
          </div>
        ))}
      </div>

      {hasMore && !showViewAll && (
        <button
          onClick={onViewAll}
          className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 text-center"
        >
          Show {entries.length - maxItems!} more entries
        </button>
      )}
    </div>
  )
}
