/**
 * Application-wide constants
 *
 * Centralizes magic numbers and configuration values for maintainability.
 */

/** Authentication token cookie key */
export const TOKEN_KEY = '_pokedex_token'

/**
 * Pokemon-related configuration constants
 */
export const POKEMON_CONFIG = {
  /** Maximum Pokemon ID in the PokeAPI (Gen 9) */
  MAX_POKEMON_ID: 1025,
  /** Minimum Pokemon ID */
  MIN_POKEMON_ID: 1,
  /** Default page size for pagination */
  PAGE_SIZE: 20,
  /** Maximum base stat value for progress bar scaling */
  MAX_STAT_VALUE: 255,
} as const

/**
 * Pagination display configuration
 */
export const PAGINATION_CONFIG = {
  /** Maximum visible page numbers before showing ellipsis */
  MAX_VISIBLE_PAGES: 7,
  /** Number of pages to show around current page */
  SIBLING_PAGES: 1,
  /** Threshold for showing left ellipsis (current > this) */
  LEFT_ELLIPSIS_THRESHOLD: 3,
  /** Threshold for showing right ellipsis (current < total - this) */
  RIGHT_ELLIPSIS_THRESHOLD: 2,
} as const

/**
 * UI timing constants (in milliseconds)
 */
export const TIMING = {
  /** Debounce delay for search input */
  SEARCH_DEBOUNCE_MS: 300,
  /** Debounce delay for URL sync */
  URL_SYNC_DEBOUNCE_MS: 300,
} as const

/**
 * Cookie configuration
 */
export const COOKIE_CONFIG = {
  /** Cookie expiry in seconds (7 days) */
  EXPIRY_SECONDS: 60 * 60 * 24 * 7,
} as const

/**
 * Stat name abbreviation mapping for display
 */
export const STAT_LABELS: Record<string, string> = {
  'hp': 'HP',
  'attack': 'ATK',
  'defense': 'DEF',
  'special-attack': 'SATK',
  'special-defense': 'SDEF',
  'speed': 'SPD',
} as const
