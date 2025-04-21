export const ONE_HOUR_MS = 3_600_000
export const ONE_YEAR_MS = 31_557_600_000
export const TWO_YEARS_MS = 2 * ONE_YEAR_MS
export const TWENTY_FOUR_HOURS_MS = 24 * ONE_HOUR_MS
export const PROTOCOL_FEE = 0
export const TIME_TOLERANCE_MS = process.env.NODE_ENV == "emulator" ? 0 : 100_000
