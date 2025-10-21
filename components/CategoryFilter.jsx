// components/CategoryFilter.jsx
'use client';
import { motion } from 'framer-motion';

export default function CategoryFilter({
    categories,
    selectedCategory,
    onCategoryChange
}) {
    // Ensure categories is an array and handle potential data structure issues
    const safeCategories = Array.isArray(categories) ? categories : [];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
                {/* All Categories Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCategoryChange("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === "all"
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    All Categories
                </motion.button>

                {/* Category Buttons */}
                {safeCategories.map((category) => {
                    // Handle different category data structures
                    const categoryId = category?.id || category?.value || category;
                    const categoryName = category?.name || category?.label ||
                        (typeof category === 'string' ? category : 'Unknown');

                    return (
                        <motion.button
                            key={categoryId}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onCategoryChange(categoryId)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === categoryId
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {categoryName}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}