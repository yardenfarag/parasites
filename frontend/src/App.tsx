import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Search, Filter, Bug, Microscope, Zap } from 'lucide-react';
import WormCrawler from './components/WormCrawler';
import SearchBar from './components/SearchBar';
import ParasiteCard from './components/ParasiteCard';
import CategoryFilter from './components/CategoryFilter';
import type { Parasite } from './types/parasite';
import { parasiteApi } from './services/api';

const queryClient = new QueryClient();

function ParasiteApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch parasites using React Query
  const { data: parasites = [], isLoading, error } = useQuery({
    queryKey: ['parasites', searchTerm, selectedCategory],
    queryFn: () => parasiteApi.searchParasites(searchTerm, selectedCategory === 'all' ? undefined : selectedCategory),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch categories
  const { data: categories = ['all'] } = useQuery({
    queryKey: ['categories'],
    queryFn: parasiteApi.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const allCategories = ['all', ...categories];

  return (
    <div className="min-h-screen bg-parasite-dark text-parasite-green relative overflow-hidden">
        {/* Background effects */}
        <div className="matrix-bg"></div>
        
        {/* Worm crawlers */}
        <WormCrawler />
        <WormCrawler delay={2000} />
        <WormCrawler delay={4000} />

        {/* Header */}
        <header className="relative z-10 p-6 border-b border-parasite-green/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Bug className="w-8 h-8 text-parasite-green glow-text" />
                  <h1 className="text-3xl font-bold text-parasite-green glow-text font-['Creepster']">
                    PARASITE ATLAS
                  </h1>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-parasite-slime">
                  <Microscope className="w-5 h-5" />
                  <span className="text-sm">Database of Microbial Life</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-parasite-slime">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">{parasites.length} Species</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Search and Filter Section */}
            <div className="mb-8 space-y-6">
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isLoading={isLoading}
            />
            <CategoryFilter
              categories={allCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            </div>

            {/* Results */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-parasite-green">
                  {parasites.length} Species Found
                </h2>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-parasite-slime hover:text-parasite-green transition-colors text-sm"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <Bug className="w-16 h-16 text-parasite-blood mx-auto mb-4" />
                <h3 className="text-xl text-parasite-blood mb-2">Error loading parasites</h3>
                <p className="text-parasite-decay/70">
                  Failed to connect to the parasite database. Please try again later.
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-parasite-green mx-auto mb-4"></div>
                <h3 className="text-xl text-parasite-green mb-2">Scanning the microscopic world...</h3>
                <p className="text-parasite-slime/70">
                  Gathering parasite data from the depths of biology
                </p>
              </div>
            )}

            {/* Parasite Grid */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {parasites.map((parasite) => (
                  <ParasiteCard key={parasite.id} parasite={parasite} />
                ))}
              </div>
            )}

            {!isLoading && !error && parasites.length === 0 && (
              <div className="text-center py-12">
                <Bug className="w-16 h-16 text-parasite-decay mx-auto mb-4" />
                <h3 className="text-xl text-parasite-decay mb-2">No parasites found</h3>
                <p className="text-parasite-decay/70">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-parasite-green/20 p-6 mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-parasite-slime/70 text-sm">
              Parasite Atlas - Exploring the microscopic world of parasites and bacteria
            </p>
          </div>
        </footer>
      </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ParasiteApp />
    </QueryClientProvider>
  );
}

export default App;