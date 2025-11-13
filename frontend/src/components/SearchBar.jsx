import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes, FaUpload } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { apiService } from '../services/apiService';

const SearchBar = ({
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const { selectedLocation } = useSelector((state) => state.location);

  // Animation states
  const words = ['Radiology', 'Pathology', 'Tests'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    let timeout;

    if (isTyping && currentText !== word) {
      timeout = setTimeout(() => {
        setCurrentText(word.slice(0, currentText.length + 1));
      }, 150); // Typing speed
    } else if (isTyping && currentText === word) {
      timeout = setTimeout(() => {
        setIsTyping(false);
        setIsErasing(true);
      }, 1000); // Pause before erasing
    } else if (isErasing && currentText !== '') {
      timeout = setTimeout(() => {
        setCurrentText(currentText.slice(0, -1));
      }, 100); // Erasing speed
    } else if (isErasing && currentText === '') {
      setIsErasing(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      setIsTyping(true);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isTyping, isErasing, currentWordIndex, words]);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 3 && selectedLocation) {
        setIsLoadingSuggestions(true);
        try {
          const cityName = selectedLocation.name || 'bengaluru';
          console.log('Fetching suggestions for:', query, 'in city:', cityName);
          const response = await apiService.searchTests(query, cityName);
          console.log('API Response:', response);

          if (response && response.radiology_tests && response.radiology_tests.length > 0) {
            // Extract unique test names for suggestions
            const uniqueSuggestions = [...new Set(
              response.radiology_tests.map(test => test.name)
            )].slice(0, 10); // Limit to 10 suggestions

            console.log('Suggestions found:', uniqueSuggestions);
            setSuggestions(uniqueSuggestions);
            setShowSuggestions(true);
          } else {
            console.log('No radiology_tests found in response');
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300); // Debounce API calls
    return () => clearTimeout(debounceTimer);
  }, [query, selectedLocation]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleUploadPrescription = () => {
    // Handle prescription upload logic
    console.log('Upload prescription clicked');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm px-4 py-3 w-full max-w-2xl relative">
      {/* Search Bar */}
      <div className="relative flex items-center bg-gray-50 hover:bg-gray-100 rounded-full px-5 py-3 border border-gray-200 transition">
        <FaSearch className="text-green-500 mr-3" />

        <input
          ref={searchInputRef}
          type="text"
          placeholder=""
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />

        {!query && (
          <div className="absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none text-sm text-gray-400">
            Search for <span className="text-green-500 font-bold">{currentText}</span>
          </div>
        )}

        {query && (
          <button onClick={clearSearch} className="mr-2">
            <FaTimes className="text-gray-400 text-sm" />
          </button>
        )}

        <button
          onClick={handleUploadPrescription}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full ml-2 transition"
          aria-label="Upload prescription"
        >
          <FaUpload className="text-base" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1"
        >
          {isLoadingSuggestions ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Loading suggestions...
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-sm text-gray-700"
              >
                {suggestion}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
