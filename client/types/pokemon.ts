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
  sprite: string | null
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

/**
 * Detailed Pokemon data from API
 */
export interface PokemonDetail {
  /** Pokemon ID from PokeAPI */
  id: number
  /** Pokemon name */
  name: string
  /** Pokemon Pokedex number */
  order: number
  /** Pokemon height in decimeters */
  height: number
  /** Pokemon weight in hectograms */
  weight: number
  /** URL to default front sprite image */
  sprite: string
  /** List of Pokemon abilities */
  abilities: Array<{
    /** Ability name */
    name: string
    /** Whether this is a hidden ability */
    is_hidden: boolean
  }>
  /** List of Pokemon moves (limited to first 20) */
  moves: Array<{
    /** Move name */
    name: string
  }>
  /** List of Pokemon forms */
  forms: Array<{
    /** Form name */
    name: string
  }>
  /** List of Pokemon types */
  types: Array<{
    /** Type name (e.g., fire, water, grass) */
    name: string
  }>
  /** Pokemon stats */
  stats: Array<{
    /** Stat name (e.g., hp, attack, defense) */
    name: string
    /** Base stat value */
    base_stat: number
  }>
  /** Pokemon description */
  description?: string
  /** Pokemon sprites */
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
}
