import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Package, Loader2 } from 'lucide-react'

import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import useDebounce from '@/hooks/useDebounce'
import { MIN_SUGGEST_LENGTH, useSearchSuggestions } from '@/hooks/useProduct'

// Keyboard interaction is handled manually in handleKeyDown instead of relying on
// cmdk's built-in selection: cmdk auto-highlights the first item on every query
// change and always preventDefaults Enter, which would break "bare Enter goes to
// the search page". A constant value="" keeps cmdk's own selection state inert.
const HeaderSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnSearchPage = location.pathname === '/search';
  const urlQ = new URLSearchParams(location.search).get('q') ?? ''; // creates a built-in JS object that makes it easy to parse and read query string parameters(no need to manually split on & and =).

  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [focused, setFocused] = useState(false);
  // Remembers which query the user dismissed (Escape), so the dropdown stays
  // closed for that exact term but reopens as soon as the text changes.
  const [dismissedFor, setDismissedFor] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);

  const listRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { suggestions, loading, settled } = useSearchSuggestions(debouncedQuery);

  const trimmedQuery = searchQuery.trim();
  const showDropdown =
    focused &&
    dismissedFor !== trimmedQuery &&
    trimmedQuery.length >= MIN_SUGGEST_LENGTH;

  // EFFECT: Sync the URL -> the search input
  // Handles cases where the URL changes from OUTSIDE the input itself,
  // e.g. browser back/forward button, or opening a shared link with ?q=...
  useEffect(() => {
    if (!isOnSearchPage) return;
    setSearchQuery(urlQ);
  }, [isOnSearchPage, urlQ]);

  // Typing invalidates both the dismissal and any highlighted suggestion row
  useEffect(() => {
    setDismissedFor('');
    setActiveIdx(-1);
  }, [trimmedQuery]);

  // Keep the highlighted row visible while arrowing through a scrolled list
  useEffect(() => {
    if (activeIdx < 0) return;
    listRef.current
      ?.querySelector(`[data-idx="${activeIdx}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const goToSearchPage = (q) => {
    setFocused(false);
    setDismissedFor(q);
    navigate(`/search?q=${encodeURIComponent(q)}`, { replace: isOnSearchPage });
  };

  const goToProduct = (id) => {
    setFocused(false);
    setActiveIdx(-1);
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = (e) => {
    // Stop the browser's default full-page-reload form submission behavior
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    goToSearchPage(q);
  };

  const handleKeyDown = (e) => {
    // Don't hijack keys while an IME composition is in progress (e.g. Chinese/Japanese input)
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); // also stops cmdk's internal selection handling
      if (suggestions.length === 0) return;
      setActiveIdx((idx) => {
        const next = idx + (e.key === 'ArrowDown' ? 1 : -1);
        // Clamp at the ends instead of looping around
        if (next < 0 || next >= suggestions.length) return idx;
        return next;
      });
    } else if (e.key === 'Enter') {
      // preventDefault stops BOTH the native form submit and cmdk's internal
      // "select highlighted item" dispatch - we decide what Enter does here.
      e.preventDefault();
      const q = searchQuery.trim();
      if (!q) return;
      const active = suggestions[activeIdx];
      if (activeIdx >= 0 && active) goToProduct(active._id);
      else goToSearchPage(q);
    } else if (e.key === 'Escape') {
      setDismissedFor(searchQuery.trim());
      setFocused(false);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className='flex items-center flex-1 w-full mx-auto sm:mx-8'>
      <div className='relative w-full'>
        <Command
          shouldFilter={false}
          value=''
          onKeyDown={handleKeyDown}
          className='overflow-visible bg-transparent [&_[data-slot=command-input-wrapper]]:h-auto [&_[data-slot=command-input-wrapper]]:gap-2 [&_[data-slot=command-input-wrapper]]:border-b-0 [&_[data-slot=command-input-wrapper]]:rounded-lg [&_[data-slot=command-input-wrapper]]:border [&_[data-slot=command-input-wrapper]]:px-4 [&_[data-slot=command-input-wrapper]]:py-2 focus-within:[&_[data-slot=command-input-wrapper]]:border-green-500 [&_[data-slot=command-input-wrapper]]:border-gray-300 dark:[&_[data-slot=command-input-wrapper]]:bg-gray-800 dark:[&_[data-slot=command-input-wrapper]]:border-gray-600'
        >
          <CommandInput
            type='text'
            id='Search'
            placeholder='Search products...'
            value={searchQuery}
            onValueChange={setSearchQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className='h-8 text-base md:text-sm'
          />
          <button
            type="submit"
            aria-label="Search"
            className='absolute right-3 top-[13px] text-gray-400 hover:text-green-500 transition-colors cursor-pointer z-10'
          >
            <Search className='w-5 h-5' />
          </button>

          {showDropdown && (
            <CommandList
              ref={listRef}
              className='absolute inset-x-0 top-full z-50 mt-2 max-h-[320px] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'
            >
              {loading && suggestions.length === 0 ? (
                <div className='flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-500 dark:text-gray-400'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Searching...
                </div>
              ) : settled && suggestions.length === 0 ? (
                <div className='px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400'>
                  No products found for &ldquo;{trimmedQuery}&rdquo;
                </div>
              ) : (
                <CommandGroup heading='Products'>
                  {suggestions.map((product, idx) => (
                    <CommandItem
                      key={product._id}
                      value={product._id}
                      data-idx={idx}
                      onSelect={() => goToProduct(product._id)}
                      onMouseMove={() => setActiveIdx(idx)}
                      className={`cursor-pointer gap-3 px-3 py-2 aria-selected:bg-transparent ${
                        idx === activeIdx ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=''
                          className='h-10 w-10 shrink-0 rounded-md border border-gray-200 object-contain dark:border-gray-600'
                        />
                      ) : (
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700'>
                          <Package className='h-5 w-5 text-gray-400' />
                        </div>
                      )}
                      <span className='flex-1 truncate text-sm'>{product.name}</span>
                      <span className='shrink-0 text-xs text-gray-500 dark:text-gray-400'>
                        {product.category}
                      </span>
                      <span className='shrink-0 font-semibold text-gray-900 dark:text-white'>
                        {`₹${product.price}`}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          )}
        </Command>
      </div>
    </form>
  )
}

export default HeaderSearch
