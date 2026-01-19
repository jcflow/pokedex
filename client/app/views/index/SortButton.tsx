'use client'

import { useUIStore, type SortBy } from '@/store/useUIStore'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import numberIcon from '@/icons/number.svg'
import azIcon from '@/icons/az.svg'
import SortPopup from './SortPopup'

export default function SortButton() {
  const { sortBy, setSortBy } = useUIStore()
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleSortChange = (sort: SortBy) => {
    setSortBy(sort)
    setIsOpen(false)
  }

  // Restore focus to button when modal closes
  useEffect(() => {
    if (!isOpen && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [isOpen])

  return (
    <div className="relative z-10">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open sort options"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-inner hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer"
      >
        {sortBy === 'number' ? (
          <Image
            src={numberIcon}
            alt="Sort by number"
            width={24}
            height={24}
            className="w-6 h-6 primary-text"
          />
        ) : (
          <Image
            src={azIcon}
            alt="Sort by name"
            width={24}
            height={24}
            className="w-6 h-6 primary-text"
          />
        )}
      </button>

      <SortPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentSort={sortBy}
        onSortChange={handleSortChange}
      />
    </div>
  )
}
