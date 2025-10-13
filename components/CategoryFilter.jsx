// components/CategoryFilter.js
import { motion } from 'framer-motion';

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
                <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
            ))}
        </div>
    );
}