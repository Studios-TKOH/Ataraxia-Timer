import type { SettingTheme, SettingTimeFormat, SettingWeekStart } from './setting.dto'

export type SettingSyncStatus = 'synced' | 'pending_update'

export interface SettingModel {
  id: string

  pomodoroLength: number
  shortBreakLength: number
  longBreakLength: number
  longBreakInterval: number

  autoStartBreaks: boolean
  autoStartPomodoros: boolean

  soundEnabled: boolean
  volume: number
  theme: SettingTheme
  language: string
  timeFormat: SettingTimeFormat
  weekStart: SettingWeekStart
  notificationsEnabled: boolean

  syncStatus: SettingSyncStatus
  updatedAt: number

  /** @deprecated Old field name - migrate to pomodoroLength */
  focusDuration?: number
  /** @deprecated Old field name - migrate to shortBreakLength */
  shortBreakDuration?: number
  /** @deprecated Old field name - migrate to longBreakLength */
  longBreakDuration?: number
}
