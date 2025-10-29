'use client';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@components/MainLayout";

export default function BookDetail({ params }) {
    const router = useRouter();
    const [book, setBook] = useState(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBook = async () => {
            try {
                setLoading(true);
                const unwrappedParams = await Promise.resolve(params);
                const bookId = unwrappedParams?.id;

                if (bookId) {
                    const response = await fetch(`/api/public/books/${bookId}`);

                    if (!response.ok) {
                        throw new Error('Book not found');
                    }

                    const bookData = await response.json();
                    setBook(bookData);
                } else {
                    throw new Error('No book ID provided');
                }
            } catch (error) {
                console.error('Error loading book:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadBook();
    }, [params]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading book details...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !book) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {error || 'Book not found'}
                        </h3>
                        <p className="text-gray-500 mb-4">The book you're looking for doesn't exist or may have been removed.</p>
                        <button
                            onClick={() => router.push('/books')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Catalog
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const formatCategory = (category) => {
        return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Catalog
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* 3D Book Display */}
                        <div className="flex justify-center items-center">
                            <div className="relative w-80 h-96 perspective-1000">
                                <motion.div
                                    className="relative w-full h-full preserve-3d transition-transform duration-1000"
                                    animate={{ rotateY: isFlipping ? 180 : 0 }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Front Cover */}
                                    <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl">
                                        {book.coverImage ? (
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="w-full h-full object-cover rounded-2xl"
                                                onError={(e) => {
                                                    // Fallback if cover image fails to load
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : null}
                                        {!book.coverImage && (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 flex flex-col justify-between text-white">
                                                <div>
                                                    <h2 className="text-2xl font-bold mb-2 leading-tight">{book.title}</h2>
                                                    <p className="text-blue-100 text-sm">by {book.author}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-3xl font-bold">${book.price}</div>
                                                    <div className="text-blue-200 text-sm">BookVerse</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Back Cover */}
                                    <div
                                        className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl"
                                        style={{ transform: 'rotateY(180deg)' }}
                                    >
                                        {book.backCoverImage ? (
                                            <img
                                                src={book.backCoverImage}
                                                alt={`${book.title} back cover`}
                                                className="w-full h-full object-cover rounded-2xl"
                                                onError={(e) => {
                                                    // Fallback if back cover image fails to load
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : null}
                                        {!book.backCoverImage && (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
                                                <div className="mb-6">
                                                    <h3 className="text-lg font-bold mb-2">Synopsis</h3>
                                                    <p className="text-gray-300 text-sm line-clamp-4">
                                                        {book.description}
                                                    </p>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Category:</span>
                                                        <span className="capitalize">{formatCategory(book.category)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Pages:</span>
                                                        <span>{book.pages || '320'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">ISBN:</span>
                                                        <span>{book.isbn || '978-3-16-148410-0'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Format:</span>
                                                        <span>{book.format}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Flip Button */}
                                <button
                                    onClick={() => setIsFlipping(!isFlipping)}
                                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition-colors border border-gray-200"
                                >
                                    {isFlipping ? 'Show Front' : 'Show Back'}
                                </button>
                            </div>
                        </div>

                        {/* Book Details */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800 mb-2">{book.title}</h1>
                                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                                        <span className="font-bold mr-1">⭐ {book.rating}</span>
                                        <span>Rating</span>
                                    </div>
                                    <div className="text-green-600 text-2xl font-bold">
                                        ${book.price}
                                    </div>
                                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                                        {formatCategory(book.category)}
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8">
                                    {['description', 'author', 'details'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="prose max-w-none">
                                {activeTab === 'description' && (
                                    <div>
                                        <p className="text-gray-700 leading-relaxed mb-4">{book.description}</p>
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                            <p className="text-yellow-700 text-sm">
                                                <strong>Note:</strong> This book is available for both purchase and borrowing.
                                                Borrowing period is 30 days.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'author' && (
                                    <div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                {book.author.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">{book.author}</h3>
                                                <p className="text-gray-600">Bestselling Author</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {book.author} is an accomplished writer with multiple bestselling titles
                                            in the {formatCategory(book.category)} genre. With a passion for storytelling
                                            and deep character development, their works have captivated readers worldwide.
                                        </p>
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <strong className="text-gray-700">Published Works:</strong>
                                                <p className="text-gray-600">15+ Books</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-700">Awards:</strong>
                                                <p className="text-gray-600">Literary Excellence Award 2023</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'details' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <strong className="text-gray-700">Publisher:</strong>
                                                <p className="text-gray-600">{book.publisher}</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-700">Published Date:</strong>
                                                <p className="text-gray-600">
                                                    {book.publishedDate
                                                        ? new Date(book.publishedDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })
                                                        : 'Not specified'
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-700">Pages:</strong>
                                                <p className="text-gray-600">{book.pages || '320'}</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-700">Language:</strong>
                                                <p className="text-gray-600">{book.language}</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-700">ISBN:</strong>
                                                <p className="text-gray-600">{book.isbn || '978-3-16-148410-0'}</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-700">Format:</strong>
                                                <p className="text-gray-600">{book.format}</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-700">Stock:</strong>
                                                <p className="text-gray-600">
                                                    {book.stock > 0
                                                        ? `${book.stock} available`
                                                        : 'Out of stock'
                                                    }
                                                </p>
                                            </div>
                                            {book.featured && (
                                                <div>
                                                    <strong className="text-gray-700">Status:</strong>
                                                    <p className="text-gray-600">
                                                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                            Featured
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors shadow-lg ${book.stock > 0
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                    disabled={book.stock <= 0}
                                >
                                    {book.stock > 0
                                        ? `Add to Cart - UGX ${book.price}`
                                        : 'Out of Stock'
                                    }
                                </button>
                                <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg">
                                    Borrow for 30 Days
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-blue-50 rounded-lg p-4 mt-6">
                                <h4 className="font-semibold text-blue-800 mb-2">📚 Available Formats</h4>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="text-center bg-white rounded p-2 shadow-sm border border-blue-100">
                                        <div className="font-semibold text-blue-600">Paperback</div>
                                        <div className="text-green-600 font-medium">UGX {book.price}</div>
                                    </div>
                                    <div className="text-center bg-white rounded p-2 shadow-sm border border-blue-100">
                                        <div className="font-semibold text-blue-600">eBook</div>
                                        <div className="text-green-600 font-medium">UGX {(book.price * 0.7).toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">Save 30%</div>
                                    </div>
                                    <div className="text-center bg-white rounded p-2 shadow-sm border border-blue-100">
                                        <div className="font-semibold text-blue-600">Audiobook</div>
                                        <div className="text-green-600 font-medium">UGX {(book.price * 0.8).toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">Save 20%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2 pt-4">
                                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Add to Wishlist
                                </button>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}