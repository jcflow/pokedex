import { formatPokemonName, formatPokemonNumber } from '@/app/utils'

describe('utils', () => {
    describe('formatPokemonName', () => {
        it('capitalizes the first letter of a name', () => {
            expect(formatPokemonName('bulbasaur')).toBe('Bulbasaur')
        })

        it('capitalizes names with hyphens', () => {
            expect(formatPokemonName('mr-mime')).toBe('Mr Mime')
        })

        it('handles single letter names', () => { // Unlikely but good edge case
            expect(formatPokemonName('z')).toBe('Z')
        })
    })

    describe('formatPokemonNumber', () => {
        it('formats single digit numbers with leading zeros', () => {
            expect(formatPokemonNumber(1)).toBe('#001')
        })

        it('formats double digit numbers with leading zeros', () => {
            expect(formatPokemonNumber(25)).toBe('#025')
        })

        it('formats triple digit numbers correctly', () => {
            expect(formatPokemonNumber(151)).toBe('#151')
        })

        it('formats numbers larger than 999 correctly', () => {
            expect(formatPokemonNumber(1000)).toBe('#1000')
        })
    })
})
