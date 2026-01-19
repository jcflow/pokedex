
/**
 * Formats Pokemon name with capitalized first letter
 */
export function formatPokemonName(name: string): string {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

/**
 * Formats Pokemon number with hash and leading zeros
 */
export function formatPokemonNumber(number: number): string {
    return `#${number.toString().padStart(3, '0')}`
}