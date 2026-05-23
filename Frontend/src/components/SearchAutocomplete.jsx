import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building, Plane, Map, Train, Navigation, CalendarDays, Sparkles } from 'lucide-react';
import { DEFAULT_SEARCH_ITEMS, createFuse, normalizeSearchItem } from '../utils/searchCatalog';
import './SearchAutocomplete.css';

const iconMap = {
  Destination: <MapPin size={16} />,
  City: <MapPin size={16} />,
  Hotel: <Building size={16} />,
  Transport: <Navigation size={16} />,
  Flight: <Plane size={16} />,
  Train: <Train size={16} />,
  Activity: <Sparkles size={16} />,
  Itinerary: <CalendarDays size={16} />,
  Place: <Map size={16} />,
  Package: <Map size={16} />
};

export default function SearchAutocomplete({ 
  value, 
  onChange, 
  onSelect, 
  placeholder = "Search for destinations...", 
  className = "",
  inputClassName = "search-autocomplete-input",
  items = DEFAULT_SEARCH_ITEMS,
  storageKey = "recentSearches",
  debounceMs = 350,
  maxResults = 8,
  isLoading = false,
  onSubmitSearch
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef(null);

  const searchableItems = useMemo(() => (
    [...items, ...DEFAULT_SEARCH_ITEMS]
      .filter(Boolean)
      .map(normalizeSearchItem)
      .filter((item, index, list) => (
        item.text && list.findIndex(match => match.text.toLowerCase() === item.text.toLowerCase() && match.type === item.type) === index
      ))
  ), [items]);

  const fuse = useMemo(() => createFuse(searchableItems), [searchableItems]);
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      setRecentSearches([]);
    }
  }, [storageKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value || value.trim() === '') {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = fuse.search(value.trim()).map(result => result.item).slice(0, maxResults);
      setSuggestions(filtered);
      setIsOpen(true);
      setActiveIndex(-1);
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [debounceMs, fuse, maxResults, value]);

  const handleSelect = (text, submitAfterSelect = false) => {
    // Add to recent searches
    const updatedRecent = [text, ...recentSearches.filter(item => item !== text)].slice(0, 5);
    setRecentSearches(updatedRecent);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedRecent));
    } catch(e) {}
    
    onChange({ target: { value: text } });
    if (onSelect) {
      // Allow state update before calling onSelect if it triggers navigation
      setTimeout(() => onSelect(text), 0);
    }
    if (submitAfterSelect && onSubmitSearch) {
      setTimeout(() => onSubmitSearch(text), 0);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' && value.trim()) {
        handleSelect(value, true);
      }
      return;
    }

    const itemsCount = suggestions.length > 0 ? suggestions.length : recentSearches.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < itemsCount - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        if (suggestions.length > 0) {
          handleSelect(suggestions[activeIndex].text, true);
        } else if (recentSearches.length > 0) {
          handleSelect(recentSearches[activeIndex], true);
        }
      } else if (value.trim()) {
        handleSelect(value, true);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(storageKey);
  };

  // Helper to highlight matching text
  const renderHighlightedText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <strong key={i} style={{ color: '#1d4ed8' }}>{part}</strong> : part
        )}
      </span>
    );
  };

  return (
    <div className={`search-autocomplete-wrapper ${className}`} ref={wrapperRef}>
      <div className="search-autocomplete-input-wrapper">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={inputClassName}
          aria-label={placeholder}
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
      </div>

      {isOpen && (value.trim() || recentSearches.length > 0) && (
        <div className="search-autocomplete-dropdown slide-down-anim" role="listbox">
          {(isLoading || isSearching) && value.trim() ? (
            <div className="search-autocomplete-state">
              <span className="search-autocomplete-spinner" aria-hidden="true"></span>
              Searching...
            </div>
          ) : value.trim() && suggestions.length === 0 ? (
            <div className="search-autocomplete-empty">
              No results found for "{value}"
            </div>
          ) : value.trim() && suggestions.length > 0 ? (
            <ul className="search-autocomplete-list">
              {suggestions.map((item, index) => (
                <li 
                  key={index} 
                  className={`search-autocomplete-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => handleSelect(item.text)}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <div className="search-autocomplete-item-icon">{item.icon || iconMap[item.type] || <Search size={16} />}</div>
                  <div className="search-autocomplete-item-text">
                    <span className="text">{renderHighlightedText(item.text, value)}</span>
                    <span className="type">{item.type}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : recentSearches.length > 0 ? (
            <div className="search-autocomplete-recent">
              <div className="search-autocomplete-recent-header">
                <span>Recent Searches</span>
                <button onClick={clearRecent}>Clear</button>
              </div>
              <ul className="search-autocomplete-list">
                {recentSearches.map((item, index) => (
                  <li 
                    key={`recent-${index}`} 
                    className={`search-autocomplete-item ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <div className="search-autocomplete-item-icon"><Search size={16} /></div>
                    <div className="search-autocomplete-item-text">
                      <span className="text">{item}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
