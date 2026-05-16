import { neon } from "@neondatabase/serverless"

// Defer SQL client initialization to avoid errors at module load time
let sql: any = null

function getSql() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

// ============= User Settings =============

export async function getUserSettings(userId: string) {
  const result = await getSql()`
    SELECT * FROM user_settings WHERE user_id = ${userId}
  `
  return result[0] || null
}

export async function createOrUpdateUserSettings(
  userId: string,
  settings: {
    water_goal?: number
    mood_streak?: number
    water_streak?: number
    last_mood_date?: string | null
    last_water_date?: string | null
    show_onboarding?: boolean
  }
) {
  const result = await getSql()`
    INSERT INTO user_settings (user_id, water_goal, mood_streak, water_streak, last_mood_date, last_water_date, show_onboarding)
    VALUES (
      ${userId}, 
      ${settings.water_goal ?? 8}, 
      ${settings.mood_streak ?? 0}, 
      ${settings.water_streak ?? 0},
      ${settings.last_mood_date ?? null},
      ${settings.last_water_date ?? null},
      ${settings.show_onboarding ?? true}
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      water_goal = COALESCE(${settings.water_goal}, user_settings.water_goal),
      mood_streak = COALESCE(${settings.mood_streak}, user_settings.mood_streak),
      water_streak = COALESCE(${settings.water_streak}, user_settings.water_streak),
      last_mood_date = COALESCE(${settings.last_mood_date}, user_settings.last_mood_date),
      last_water_date = COALESCE(${settings.last_water_date}, user_settings.last_water_date),
      show_onboarding = COALESCE(${settings.show_onboarding}, user_settings.show_onboarding),
      updated_at = NOW()
    RETURNING *
  `
  return result[0]
}

export async function updateStreak(
  userId: string,
  type: "mood" | "water",
  date: string
) {
  const settings = await getUserSettings(userId)
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

  let newStreak = 1
  const lastDate = type === "mood" ? settings?.last_mood_date : settings?.last_water_date
  const currentStreak = type === "mood" ? settings?.mood_streak : settings?.water_streak

  if (lastDate) {
    const lastDateStr = new Date(lastDate).toISOString().split("T")[0]
    if (lastDateStr === today) {
      // Already logged today, no streak change
      return currentStreak || 0
    } else if (lastDateStr === yesterday) {
      // Consecutive day, increment streak
      newStreak = (currentStreak || 0) + 1
    }
    // Otherwise, streak resets to 1
  }

  if (type === "mood") {
    await createOrUpdateUserSettings(userId, {
      mood_streak: newStreak,
      last_mood_date: date,
    })
  } else {
    await createOrUpdateUserSettings(userId, {
      water_streak: newStreak,
      last_water_date: date,
    })
  }

  return newStreak
}

// ============= Mood Entries =============

export async function getMoodEntries(userId: string, limit = 30) {
  const result = await getSql()`
    SELECT * FROM mood_entries 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `
  return result
}

export async function getLatestMoodEntry(userId: string) {
  const result = await getSql()`
    SELECT * FROM mood_entries 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT 1
  `
  return result[0] || null
}

export async function createMoodEntry(
  userId: string,
  mood: string,
  note?: string
) {
  const result = await getSql()`
    INSERT INTO mood_entries (user_id, mood, note)
    VALUES (${userId}, ${mood}, ${note || null})
    RETURNING *
  `
  
  // Update streak
  const today = new Date().toISOString().split("T")[0]
  await updateStreak(userId, "mood", today)
  
  return result[0]
}

export async function getMoodChartData(userId: string, days = 7) {
  const result = await getSql()`
    SELECT 
      DATE(created_at) as date,
      mood,
      note,
      id,
      created_at
    FROM mood_entries 
    WHERE user_id = ${userId} 
      AND created_at >= NOW() - INTERVAL '${days} days'
    ORDER BY created_at DESC
  `
  return result
}

// ============= Water Entries =============

export async function getTodayWaterEntry(userId: string) {
  const today = new Date().toISOString().split("T")[0]
  const result = await getSql()`
    SELECT * FROM water_entries 
    WHERE user_id = ${userId} AND date = ${today}
  `
  return result[0] || null
}

export async function updateWaterEntry(userId: string, glasses: number) {
  const today = new Date().toISOString().split("T")[0]
  const result = await getSql()`
    INSERT INTO water_entries (user_id, glasses, date)
    VALUES (${userId}, ${glasses}, ${today})
    ON CONFLICT (user_id, date) 
    DO UPDATE SET 
      glasses = ${glasses},
      updated_at = NOW()
    RETURNING *
  `
  
  // Check if water goal is met to update streak
  const settings = await getUserSettings(userId)
  if (glasses >= (settings?.water_goal || 8)) {
    await updateStreak(userId, "water", today)
  }
  
  return result[0]
}

export async function getWaterHistory(userId: string, days = 7) {
  const result = await getSql()`
    SELECT date, glasses 
    FROM water_entries 
    WHERE user_id = ${userId} 
      AND date >= CURRENT_DATE - INTERVAL '${days} days'
    ORDER BY date DESC
  `
  return result
}

// ============= Reminders =============

export async function getReminders(userId: string) {
  const result = await getSql()`
    SELECT * FROM reminders 
    WHERE user_id = ${userId} 
    ORDER BY time ASC
  `
  return result
}

export async function createReminder(
  userId: string,
  title: string,
  time: string,
  type: string
) {
  const result = await getSql()`
    INSERT INTO reminders (user_id, title, time, type)
    VALUES (${userId}, ${title}, ${time}, ${type})
    RETURNING *
  `
  return result[0]
}

export async function toggleReminder(userId: string, reminderId: string) {
  const result = await getSql()`
    UPDATE reminders 
    SET 
      completed = NOT completed,
      completed_at = CASE WHEN NOT completed THEN NOW() ELSE NULL END
    WHERE id = ${reminderId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0]
}

export async function deleteReminder(userId: string, reminderId: string) {
  await getSql()`
    DELETE FROM reminders 
    WHERE id = ${reminderId} AND user_id = ${userId}
  `
}

// ============= Dashboard Data =============

export async function getDashboardData(userId: string) {
  // Get or create user settings
  let settings = await getUserSettings(userId)
  if (!settings) {
    settings = await createOrUpdateUserSettings(userId, {
      water_goal: 8,
      mood_streak: 0,
      water_streak: 0,
      show_onboarding: false,
    })
  }

  // Get latest mood entry
  const latestMood = await getLatestMoodEntry(userId)

  // Get today's water entry
  const todayWater = await getTodayWaterEntry(userId)

  // Get active reminders (not completed)
  const reminders = await getReminders(userId)
  const activeReminders = reminders.filter((r: { completed: boolean }) => !r.completed)

  // Get mood history for the past 7 days
  const moodHistory = await getMoodEntries(userId, 7)

  return {
    settings,
    latestMood,
    waterData: {
      current: todayWater?.glasses || 0,
      goal: settings.water_goal || 8,
    },
    activeReminders: activeReminders.slice(0, 3),
    moodHistory,
    moodStreak: settings.mood_streak || 0,
    waterStreak: settings.water_streak || 0,
  }
}

// ============= Analytics Data =============

export async function getAnalyticsData(userId: string) {
  const settings = await getUserSettings(userId)
  const moodEntries = await getMoodEntries(userId, 30)
  const waterHistory = await getWaterHistory(userId, 7)

  return {
    moodStreak: settings?.mood_streak || 0,
    waterStreak: settings?.water_streak || 0,
    moodEntries,
    waterHistory,
  }
}
