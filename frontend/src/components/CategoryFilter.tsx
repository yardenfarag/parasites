import React from 'react';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'protozoa': return '🦠';
      case 'nematode': return '🐛';
      case 'bacteria': return '🧬';
      case 'virus': return '🦠';
      case 'fungus': return '🍄';
      default: return '🔬';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-parasite-green">
        <Filter className="w-5 h-5" />
        <h3 className="font-semibold">Filter by Category</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full border transition-all duration-300 flex items-center space-x-2 ${
              selectedCategory === category
                ? 'border-parasite-green bg-parasite-green/20 text-parasite-green'
                : 'border-parasite-green/30 text-parasite-green/70 hover:border-parasite-green hover:text-parasite-green'
            }`}
          >
            <span className="text-lg">{getCategoryIcon(category)}</span>
            <span className="font-medium capitalize">
              {category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;