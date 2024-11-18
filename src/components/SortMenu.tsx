'use client'

import { OrderOption, SORT_OPTIONS, SortOption } from '@/lib/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { memo, useState } from 'react'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { IoIosList } from 'react-icons/io'

interface Props {
  sort: SortOption
  order: OrderOption
}

const SortMenu = memo(function SortMenu({ sort, order }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

  const selectSortOption = (selectedSort: SortOption) => {
    let newOrder: string = order

    if (sort === selectedSort && selectedSort !== 'Custom order') {
      newOrder = order === 'asc' ? 'desc' : 'asc'
    } else {
      newOrder = selectedSort === 'Custom order' ? 'asc' : newOrder
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', selectedSort)
    params.set('order', newOrder)
    window.history.pushState(null, '', `?${params.toString()}`)

    setIsOpen(false)
  }

  return (
    <div className="relative inline-text-left">
      <button
        className="flex items-center gap-1 transition-colors text-white/50 hover:text-white/80"
        onClick={toggleDropdown}
      >
        <span className="text-sm flex items-center gap-1">{`${sort}`}</span>
        <IoIosList size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-44 mt-2 origin-top-right bg-[#0a0a0a] border border-white/10 rounded-md shadow-lg">
          <div className="py-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent hover:text-white ${
                  sort === option ? 'text-accent bg-primary' : 'text-white/80'
                }`}
                onClick={() => selectSortOption(option)}
              >
                <span>{option}</span>
                {sort === option &&
                  sort !== 'Custom order' &&
                  (order === 'asc' ? (
                    <AiOutlineArrowUp size={18} />
                  ) : (
                    <AiOutlineArrowDown size={18} />
                  ))}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

export default SortMenu
