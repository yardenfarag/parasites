import React from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, isLoading }) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-parasite-green/70 w-5 h-5" />
        <input
          type="text"
          placeholder="Search parasites, bacteria, symptoms..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-parasite-decay/50 border border-parasite-green/30 rounded-lg text-parasite-green placeholder-parasite-green/50 focus:outline-none focus:border-parasite-green focus:ring-2 focus:ring-parasite-green/20 transition-all duration-300"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-parasite-green w-5 h-5 animate-spin" />
        )}
      </div>
    </div>
  );
};

export default SearchBar;