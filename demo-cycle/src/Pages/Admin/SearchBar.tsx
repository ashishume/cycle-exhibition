// SearchBar.tsx
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
}) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
      <input
        type="text"
        placeholder={`Search ${activeTab}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 
               focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
               text-white placeholder-white/50 transition-all duration-300"
      />
    </div>
  );
};

export default SearchBar;
