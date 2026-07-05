import { SettingModel } from "../types/setting.model"
import { SettingResponseDto } from "../types/setting.dto"

const DEFAULTS = {
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    volume: 50,
    theme: "dark" as const,
    language: "en",
    timeFormat: "24h" as const,
    weekStart: "monday" as const,
    notificationsEnabled: true,
}

export function mapSettingDtoToModel(dto: SettingResponseDto): SettingModel {
    return {
        id: dto.id,

        pomodoroLength: dto.pomodoroLength ?? DEFAULTS.pomodoroLength,
        shortBreakLength: dto.shortBreakLength ?? DEFAULTS.shortBreakLength,
        longBreakLength: dto.longBreakLength ?? DEFAULTS.longBreakLength,
        longBreakInterval: dto.longBreakInterval ?? DEFAULTS.longBreakInterval,

        autoStartBreaks: dto.autoStartBreaks ?? DEFAULTS.autoStartBreaks,
        autoStartPomodoros: dto.autoStartPomodoros ?? DEFAULTS.autoStartPomodoros,

        soundEnabled: dto.soundEnabled ?? DEFAULTS.soundEnabled,
        volume: dto.volume ?? DEFAULTS.volume,
        theme: dto.theme ?? DEFAULTS.theme,
        language: dto.language ?? DEFAULTS.language,
        timeFormat: dto.timeFormat ?? DEFAULTS.timeFormat,
        weekStart: dto.weekStart ?? DEFAULTS.weekStart,
        notificationsEnabled: dto.notificationsEnabled ?? DEFAULTS.notificationsEnabled,

        syncStatus: 'synced',
        updatedAt: Date.now()
    }
}

export function mapModelToUpdateDto(model: SettingModel) {
    return {
        pomodoroLength: model.pomodoroLength,
        shortBreakLength: model.shortBreakLength,
        longBreakLength: model.longBreakLength,
        longBreakInterval: model.longBreakInterval,
        autoStartBreaks: model.autoStartBreaks,
        autoStartPomodoros: model.autoStartPomodoros,
        soundEnabled: model.soundEnabled,
        volume: model.volume,
        theme: model.theme,
        language: model.language,
        timeFormat: model.timeFormat,
        weekStart: model.weekStart,
        notificationsEnabled: model.notificationsEnabled,
    }
}
