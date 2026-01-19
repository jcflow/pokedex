'use client'

import { useEffect, useRef } from 'react'
import type { SortBy } from '@/store/useUIStore'

interface SortPopupProps {
    isOpen: boolean
    onClose: () => void
    currentSort: SortBy
    onSortChange: (sort: SortBy) => void
}

export default function SortPopup({ isOpen, onClose, currentSort, onSortChange }: SortPopupProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const numberRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)

    // Handle outside click and ESC to close
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose()
            }
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleMouseDown)
            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    // Focus management
    useEffect(() => {
        if (isOpen) {
            // Focus the selected option
            if (currentSort === 'number') {
                numberRef.current?.focus()
            } else {
                nameRef.current?.focus()
            }
        }
    }, [isOpen, currentSort])

    if (!isOpen) return null

    return (
        <div
            ref={modalRef}
            className="absolute top-[calc(100%+0.5rem)] right-0 z-50 w-64 primary rounded-[1.5rem] p-2 shadow-2xl origin-top-right transition-all"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sort-title"
        >
            <h2 id="sort-title" className="text-xl font-bold text-white mb-2 pl-4 text-center">Sort by:</h2>

            <div className="bg-white rounded-[1rem] p-4 shadow-lg space-y-4">
                <label className="flex items-center space-x-4 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="relative flex items-center justify-center">
                        <input
                            ref={numberRef}
                            type="radio"
                            name="sort"
                            value="number"
                            checked={currentSort === 'number'}
                            onChange={() => onSortChange('number')}
                            className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:border-[var(--primary-red)] transition-colors focus:ring-2 focus:ring-[var(--primary-red)] focus:ring-offset-2"
                        />
                        <div className="absolute w-3 h-3 rounded-full bg-[var(--primary-red)] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-gray-900 group-hover:text-[var(--primary-red)] transition-colors">Number</span>
                </label>

                <label className="flex items-center space-x-4 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="relative flex items-center justify-center">
                        <input
                            ref={nameRef}
                            type="radio"
                            name="sort"
                            value="name"
                            checked={currentSort === 'name'}
                            onChange={() => onSortChange('name')}
                            className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:border-[var(--primary-red)] transition-colors focus:ring-2 focus:ring-[var(--primary-red)] focus:ring-offset-2"
                        />
                        <div className="absolute w-3 h-3 rounded-full bg-[var(--primary-red)] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-gray-900 group-hover:text-[var(--primary-red)] transition-colors">Name</span>
                </label>
            </div>
        </div>
    )
}
