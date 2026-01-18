/**
 * Pokemon type definitions
 */

/**
 * Individual Pokemon data
 */
export interface Pokemon {
  /** Pokemon ID from PokeAPI */
  id: number
  /** Pokemon name */
  name: string
  /** Pokemon Pokedex number */
  number: number
  /** URL to Pokemon sprite image */
  sprite: string
}

/**
 * Pokemon list response from API
 */
export interface PokemonListResponse {
  /** Total count of Pokemon */
  count: number
  /** URL to next page (if exists) */
  next: string | null
  /** URL to previous page (if exists) */
  previous: string | null
  /** Array of Pokemon results */
  results: Array<{
    /** Pokemon name */
    name: string
    /** URL to Pokemon detail endpoint */
    url: string
  }>
}
