import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'User-Agent': 'Carelink-WT/1.0',
            'Accept-Language': 'en-US,en;q=0.9',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError('Unable to fetch location suggestions. Please try again later.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    fetchSuggestions(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onChange(suggestion.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          <ul className="max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {isLoading ? (
              <li className="px-4 py-2 text-gray-500">Loading suggestions...</li>
            ) : error ? (
              <li className="px-4 py-2 text-red-500">{error}</li>
            ) : suggestions.length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No suggestions found</li>
            ) : (
              suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationInput; 