'use client';

import { useEffect, useState } from 'react';
import { IoIosList } from 'react-icons/io';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { useSearchParams, useRouter } from 'next/navigation';

const SORT_OPTIONS = ['Custom order', 'Date added'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];
export type OrderOption = 'asc' | 'desc';

const SortMenu = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialOption =
    (searchParams.get('sort') as SortOption) || 'Custom order';
  const initialOrder = (searchParams.get('order') as OrderOption) || 'asc';

  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(initialOption);
  const [sortOrder, setSortOrder] = useState<OrderOption>(initialOrder);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectSortOption = (option: SortOption) => {
    let newOrder = sortOrder;
    if (sortOption === option) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newOrder);
    } else {
      setSortOption(option);
    }
    router.push(`?sort=${encodeURIComponent(option)}&order=${encodeURIComponent(newOrder)}`, { scroll: false });

    setIsOpen(false);
  };

  return (
    <div className="relative inline-text-left">
      <button
        className="flex items-center gap-1 transition-colors text-white/50 hover:text-white/80"
        onClick={toggleDropdown}
      >
        <span className="text-sm flex items-center gap-1">
          {`${sortOption}`}
        </span>
        <IoIosList size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-44 mt-2 origin-top-right bg-[#0a0a0a] border border-white/10 rounded-md shadow-lg">
          <div className="py-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent hover:text-white ${
                  sortOption === option
                    ? 'text-accent bg-primary'
                    : 'text-white/80'
                }`}
                onClick={() => selectSortOption(option)}
              >
                <span>{option}</span>
                {sortOption === option &&
                  (sortOrder === 'asc' ? (
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
  );
};

export default SortMenu;
