/**
 * Pokemon display utility functions
 *
 * Centralized formatting functions for consistent Pokemon data display.
 */

import { STAT_LABELS, POKEMON_CONFIG } from '@/lib/constants'

/**
 * Formats Pokemon name with capitalized first letter of each word.
 * Handles hyphenated names (e.g., "ho-oh" -> "Ho Oh")
 *
 * @param name - Raw Pokemon name from API
 * @returns Formatted display name with capitalized words
 *
 * @example
 * formatPokemonName("pikachu") // "Pikachu"
 * formatPokemonName("mr-mime") // "Mr Mime"
 */
export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Formats Pokemon number with hash prefix and leading zeros.
 *
 * @param number - Pokemon Pokedex number
 * @returns Formatted number string (e.g., "#001", "#025")
 *
 * @example
 * formatPokemonNumber(1)   // "#001"
 * formatPokemonNumber(25)  // "#025"
 * formatPokemonNumber(150) // "#150"
 */
export function formatPokemonNumber(number: number): string {
  return `#${number.toString().padStart(3, '0')}`
}

/**
 * Gets abbreviated stat label for display.
 *
 * @param statName - Raw stat name from API (e.g., "special-attack")
 * @returns Abbreviated label (e.g., "SATK")
 *
 * @example
 * getStatLabel("hp")             // "HP"
 * getStatLabel("special-attack") // "SATK"
 * getStatLabel("defense")        // "DEF"
 */
export function getStatLabel(statName: string): string {
  return STAT_LABELS[statName] ?? statName.toUpperCase()
}

/**
 * Formats stat value with leading zeros for consistent display.
 *
 * @param value - Raw stat value
 * @returns Formatted value string (e.g., "045", "100")
 *
 * @example
 * formatStatValue(45)  // "045"
 * formatStatValue(100) // "100"
 */
export function formatStatValue(value: number): string {
  return String(value).padStart(3, '0')
}

/**
 * Calculates stat progress percentage for progress bar display.
 * Caps at 100% to handle edge cases where stats exceed MAX_STAT_VALUE.
 *
 * @param baseStat - Pokemon's base stat value
 * @returns Percentage value (0-100) for progress bar width
 *
 * @example
 * getStatPercentage(127) // 49.8 (127/255 * 100)
 * getStatPercentage(255) // 100
 * getStatPercentage(300) // 100 (capped)
 */
export function getStatPercentage(baseStat: number): number {
  return Math.min((baseStat / POKEMON_CONFIG.MAX_STAT_VALUE) * 100, 100)
}

/**
 * Validates and clamps Pokemon ID within valid bounds.
 *
 * @param id - Pokemon ID to validate
 * @returns Valid Pokemon ID within MIN and MAX bounds
 *
 * @example
 * clampPokemonId(0)    // 1 (clamped to min)
 * clampPokemonId(25)   // 25
 * clampPokemonId(9999) // 1025 (clamped to max)
 */
export function clampPokemonId(id: number): number {
  return Math.max(
    POKEMON_CONFIG.MIN_POKEMON_ID,
    Math.min(id, POKEMON_CONFIG.MAX_POKEMON_ID)
  )
}

/**
 * Checks if a Pokemon ID is valid (within bounds).
 *
 * @param id - Pokemon ID to check
 * @returns true if ID is within valid range
 *
 * @example
 * isValidPokemonId(25)   // true
 * isValidPokemonId(0)    // false
 * isValidPokemonId(9999) // false
 */
export function isValidPokemonId(id: number): boolean {
  return id >= POKEMON_CONFIG.MIN_POKEMON_ID && id <= POKEMON_CONFIG.MAX_POKEMON_ID
}

/**
 * Gets the previous Pokemon ID, or null if at the beginning.
 *
 * @param currentId - Current Pokemon ID
 * @returns Previous ID or null if current is first Pokemon
 *
 * @example
 * getPreviousPokemonId(25) // 24
 * getPreviousPokemonId(1)  // null
 */
export function getPreviousPokemonId(currentId: number): number | null {
  const prevId = currentId - 1
  return prevId >= POKEMON_CONFIG.MIN_POKEMON_ID ? prevId : null
}

/**
 * Gets the next Pokemon ID, or null if at the end.
 *
 * @param currentId - Current Pokemon ID
 * @returns Next ID or null if current is last Pokemon
 *
 * @example
 * getNextPokemonId(25)   // 26
 * getNextPokemonId(1025) // null
 */
export function getNextPokemonId(currentId: number): number | null {
  const nextId = currentId + 1
  return nextId <= POKEMON_CONFIG.MAX_POKEMON_ID ? nextId : null
}

/**
 * Regex pattern to extract Pokemon ID from PokeAPI URL.
 * Matches URLs like: https://pokeapi.co/api/v2/pokemon/25/
 *
 * @example
 * const match = "https://pokeapi.co/api/v2/pokemon/25/".match(POKEMON_URL_ID_REGEX)
 * // match[1] = "25"
 */
export const POKEMON_URL_ID_REGEX = /\/(\d+)\/$/

/**
 * Extracts Pokemon ID from a PokeAPI URL.
 *
 * @param url - PokeAPI Pokemon URL
 * @returns Extracted Pokemon ID or null if not found
 *
 * @example
 * extractPokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/") // 25
 * extractPokemonIdFromUrl("invalid-url") // null
 */
export function extractPokemonIdFromUrl(url: string): number | null {
  const match = url.match(POKEMON_URL_ID_REGEX)
  return match ? parseInt(match[1], 10) : null
}
