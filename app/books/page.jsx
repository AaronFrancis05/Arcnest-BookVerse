'use client';
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Layout from "@components/MainLayout";

export default function BooksCatalog() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("title");
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch books from PUBLIC API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/public/books');

                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }

                const booksData = await response.json();
                setBooks(booksData);

                // Extract unique categories from books
                const uniqueCategories = [...new Set(booksData.map(book => book.category))]
                    .map(category => ({
                        id: category,
                        name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
                    }));

                setCategories(uniqueCategories);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredAndSortedBooks = useMemo(() => {
        if (!books.length) return [];

        let filtered = books.filter(book =>
            selectedCategory === "all" || book.category === selectedCategory
        );

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sorting
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "title":
                    return a.title.localeCompare(b.title);
                case "author":
                    return a.author.localeCompare(b.author);
                case "price":
                    return a.price - b.price;
                case "rating":
                    return b.rating - a.rating;
                case "newest":
                    return new Date(b.publishedDate) - new Date(a.publishedDate);
                default:
                    return 0;
            }
        });
    }, [books, selectedCategory, sortBy, searchQuery]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading books...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Error loading books
                        </h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-800 mb-4"
                    >
                        Book Catalog
                    </motion.h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our extensive collection of books across various categories
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="max-w-7xl mx-auto px-4 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Books
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by title, author, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="title">Title A-Z</option>
                                    <option value="author">Author A-Z</option>
                                    <option value="price">Price Low to High</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-gray-600">
                            Showing {filteredAndSortedBooks.length} of {books.length} books
                        </p>
                        <div className="flex gap-2">
                            {selectedCategory !== "all" && (
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Books Grid */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {filteredAndSortedBooks.map((book) => (
                                <motion.div
                                    key={book._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link href={`/books/${book._id}`}>
                                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
                                            {/* Book Cover */}
                                            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                                                {book.coverImage ? (
                                                    <img
                                                        src={book.coverImage}
                                                        alt={book.title}
                                                        className="w-24 h-32 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            // Fallback if image fails to load
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-24 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center ${book.coverImage ? 'hidden' : 'flex'}`}>
                                                    <span className="text-xs font-semibold text-gray-700 text-center px-2">
                                                        {book.title.split(' ').slice(0, 2).join(' ')}
                                                    </span>
                                                </div>
                                                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                                                    ⭐ {book.rating}
                                                </div>
                                            </div>

                                            {/* Book Info */}
                                            <div className="p-4 flex-1 flex flex-col">
                                                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {book.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                                                <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">
                                                    {book.description}
                                                </p>

                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className="text-lg font-bold text-green-600">
                                                        ${book.price}
                                                    </span>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                                                        {book.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Empty State */}
                    {filteredAndSortedBooks.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                No books found
                            </h3>
                            <p className="text-gray-500">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}