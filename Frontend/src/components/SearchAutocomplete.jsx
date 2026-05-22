import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building, Plane, Map, Train, Navigation } from 'lucide-react';
import './SearchAutocomplete.css';

const SUGGESTIONS_DB = [
  // Cities
  { type: 'City', text: 'Delhi', icon: <MapPin size={16} /> },
  { type: 'City', text: 'Dubai', icon: <MapPin size={16} /> },
  { type: 'City', text: 'Dharamshala', icon: <MapPin size={16} /> },
  { type: 'City', text: 'Dehradun', icon: <MapPin size={16} /> },
  { type: 'City', text: 'Mumbai', icon: <MapPin size={16} /> },
  { type: 'City', text: 'London', icon: <MapPin size={16} /> },
  { type: 'City', text: 'Paris', icon: <MapPin size={16} /> },
  { type: 'City', text: 'New York', icon: <MapPin size={16} /> },
  { type: 'City', text: 'Goa', icon: <MapPin size={16} /> },
  { type: 'City', text: 'Manali', icon: <MapPin size={16} /> },
  // Flights
  { type: 'Flight', text: 'Domestic Flights', icon: <Plane size={16} /> },
  { type: 'Flight', text: 'International Flights', icon: <Plane size={16} /> },
  { type: 'Flight', text: 'Delhi to Mumbai Flights', icon: <Plane size={16} /> },
  // Hotels
  { type: 'Hotel', text: 'Deluxe Hotels', icon: <Building size={16} /> },
  { type: 'Hotel', text: 'Luxury Resorts', icon: <Building size={16} /> },
  { type: 'Hotel', text: 'Budget Hotels', icon: <Building size={16} /> },
  // Places
  { type: 'Place', text: 'Taj Mahal', icon: <Map size={16} /> },
  { type: 'Place', text: 'Eiffel Tower', icon: <Map size={16} /> },
  { type: 'Place', text: 'Colosseum', icon: <Map size={16} /> },
  // Transport
  { type: 'Transport', text: 'Trains to Delhi', icon: <Train size={16} /> },
  { type: 'Transport', text: 'Airport Cabs', icon: <Navigation size={16} /> },
  // Packages
  { type: 'Package', text: 'Honeymoon Packages', icon: <Map size={16} /> },
  { type: 'Package', text: 'Weekend Getaways', icon: <Map size={16} /> },
];

export default function SearchAutocomplete({ 
  value, 
  onChange, 
  onSelect, 
  placeholder = "Search for destinations...", 
  className = "",
  inputClassName = "search-autocomplete-input"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse recent searches', e);
    }
  }, []);

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
      return;
    }

    const timer = setTimeout(() => {
      const query = value.toLowerCase();
      const filtered = SUGGESTIONS_DB.filter(item => 
        item.text.toLowerCase().includes(query)
      ).slice(0, 8); // Max 8 suggestions
      setSuggestions(filtered);
      setIsOpen(true);
      setActiveIndex(-1);
    }, 200); // Debounce 200ms

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (text) => {
    // Add to recent searches
    const updatedRecent = [text, ...recentSearches.filter(item => item !== text)].slice(0, 5);
    setRecentSearches(updatedRecent);
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    } catch(e) {}
    
    onChange({ target: { value: text } });
    if (onSelect) {
      // Allow state update before calling onSelect if it triggers navigation
      setTimeout(() => onSelect(text), 0);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' && value.trim()) {
        handleSelect(value);
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
          handleSelect(suggestions[activeIndex].text);
        } else if (recentSearches.length > 0) {
          handleSelect(recentSearches[activeIndex]);
        }
      } else if (value.trim()) {
        handleSelect(value);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Helper to highlight matching text
  const renderHighlightedText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
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
        />
      </div>

      {isOpen && (value.trim() || recentSearches.length > 0) && (
        <div className="search-autocomplete-dropdown slide-down-anim">
          {value.trim() && suggestions.length === 0 ? (
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
                >
                  <div className="search-autocomplete-item-icon">{item.icon}</div>
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
