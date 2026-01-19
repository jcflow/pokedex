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
 * Pokemon result item from API
 */
export interface PokemonResult {
  /** Pokemon name */
  name: string
  /** URL to Pokemon detail endpoint */
  url: string
  /** Pokemon number (only present when using search/sort) */
  number?: number
}

/**
 * Pokemon list response from API
 *
 * When using search or sort params, the response includes:
 * - total: Total count of filtered results
 * - total_pages: Total number of pages
 * - page: Current page number
 *
 * When not using search/sort (basic pagination):
 * - count: Total count of Pokemon
 * - next/previous: URLs for pagination
 */
export interface PokemonListResponse {
  /** Total count of Pokemon (basic pagination) */
  count?: number
  /** URL to next page (basic pagination) */
  next?: string | null
  /** URL to previous page (basic pagination) */
  previous?: string | null
  /** Total count of filtered results (search/sort mode) */
  total?: number
  /** Total number of pages (search/sort mode) */
  total_pages?: number
  /** Current page number (search/sort mode) */
  page?: number
  /** Array of Pokemon results */
  results: PokemonResult[]
}

/**
 * Pokemon type information
 *
 * API can return either wrapped format (with slot) or direct format.
 * Use type guard `isPokemonTypeWrapper` to check format.
 */
export interface PokemonType {
  /** Type name (e.g., fire, water, grass) */
  name: string
}

/**
 * Wrapped Pokemon type from PokeAPI (includes slot information)
 */
export interface PokemonTypeWrapper {
  /** Slot position (1 = primary type, 2 = secondary type) */
  slot: number
  /** Type information */
  type: PokemonType
}

/**
 * Type guard to check if type is wrapped format
 */
export function isPokemonTypeWrapper(
  typeObj: PokemonType | PokemonTypeWrapper
): typeObj is PokemonTypeWrapper {
  return 'type' in typeObj && typeof typeObj.type === 'object'
}

/**
 * Extract type name from either wrapped or direct format
 */
export function getTypeName(typeObj: PokemonType | PokemonTypeWrapper): string {
  return isPokemonTypeWrapper(typeObj) ? typeObj.type.name : typeObj.name
}

/**
 * Pokemon stat information
 */
export interface PokemonStat {
  /** Stat name (e.g., hp, attack, defense) */
  name: string
  /** Base stat value */
  base_stat: number
}

/**
 * Wrapped Pokemon stat from PokeAPI
 */
export interface PokemonStatWrapper {
  /** Base stat value */
  base_stat: number
  /** Effort value */
  effort: number
  /** Stat information */
  stat: {
    name: string
    url: string
  }
}

/**
 * Type guard to check if stat is wrapped format
 */
export function isPokemonStatWrapper(
  statObj: PokemonStat | PokemonStatWrapper
): statObj is PokemonStatWrapper {
  return 'stat' in statObj && typeof statObj.stat === 'object'
}

/**
 * Extract stat name from either wrapped or direct format
 */
export function getStatName(statObj: PokemonStat | PokemonStatWrapper): string {
  return isPokemonStatWrapper(statObj) ? statObj.stat.name : statObj.name
}

/**
 * Extract base stat value from either format
 */
export function getBaseStat(statObj: PokemonStat | PokemonStatWrapper): number {
  return statObj.base_stat
}

/**
 * Pokemon move information
 */
export interface PokemonMove {
  /** Move name */
  name: string
}

/**
 * Wrapped Pokemon move from PokeAPI
 */
export interface PokemonMoveWrapper {
  /** Move information */
  move: {
    name: string
    url: string
  }
}

/**
 * Type guard to check if move is wrapped format
 */
export function isPokemonMoveWrapper(
  moveObj: PokemonMove | PokemonMoveWrapper
): moveObj is PokemonMoveWrapper {
  return 'move' in moveObj && typeof moveObj.move === 'object'
}

/**
 * Extract move name from either wrapped or direct format
 */
export function getMoveName(moveObj: PokemonMove | PokemonMoveWrapper): string {
  return isPokemonMoveWrapper(moveObj) ? moveObj.move.name : moveObj.name
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
  moves: Array<PokemonMove | PokemonMoveWrapper>
  /** List of Pokemon forms */
  forms: Array<{
    /** Form name */
    name: string
  }>
  /** List of Pokemon types */
  types: Array<PokemonType | PokemonTypeWrapper>
  /** Pokemon stats */
  stats: Array<PokemonStat | PokemonStatWrapper>
  /** Pokemon description */
  description?: string
  /** Pokemon sprites */
  sprites: {
    other?: {
      'official-artwork'?: {
        front_default?: string
      }
    }
  }
}
