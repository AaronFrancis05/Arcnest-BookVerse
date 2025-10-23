'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Layout from '@components/MainLayout';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('add-book');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            if (!user) {
                router.push('/sign-in');
                return;
            }

            // Check admin status directly from user metadata (client-side)
            const isAdmin = user.publicMetadata?.role === 'admin';

            if (!isAdmin) {
                router.push('/');
                return;
            }

            setLoading(false);
        }
    }, [user, isLoaded, router]);

    if (!isLoaded || loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Checking permissions...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    // Final client-side check
    const isAdmin = user?.publicMetadata?.role === 'admin';

    if (!isAdmin) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🚫</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                        <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-gray-800 mb-4"
                        >
                            Admin Dashboard
                        </motion.h1>
                        <p className="text-lg text-gray-600">
                            Manage books, authors, and transactions in your BookVerse collection
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-lg mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {[
                                    { id: 'add-book', name: 'Add New Book' },
                                    { id: 'add-author', name: 'Add New Author' },
                                    { id: 'manage-books', name: 'Manage Books' },
                                    { id: 'transactions', name: 'Transactions' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'add-book' && <AddBookForm />}
                            {activeTab === 'add-author' && <AddAuthorForm />}
                            {activeTab === 'manage-books' && <ManageBooks />}
                            {activeTab === 'transactions' && <Transactions />}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Add Book Form Component with Cloudinary upload and author selection
function AddBookForm() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        category: '',
        price: '',
        pages: '',
        isbn: '',
        publishedDate: '',
        coverImage: '',
        backCoverImage: '',
        publisher: '',
        language: 'English',
        format: 'Paperback'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [authors, setAuthors] = useState([]);
    const [uploading, setUploading] = useState(false);

    const categories = [
        { id: "fiction", name: "Fiction" },
        { id: "non-fiction", name: "Non-Fiction" },
        { id: "science", name: "Science" },
        { id: "technology", name: "Technology" },
        { id: "biography", name: "Biography" },
        { id: "history", name: "History" },
        { id: "fantasy", name: "Fantasy" },
        { id: "mystery", name: "Mystery" },
    ];

    // Fetch authors from database
    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await fetch('/api/admin/authors');
            const data = await response.json();
            if (response.ok) {
                setAuthors(data.authors || []);
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

    // Generate ISBN
    const generateISBN = () => {
        const prefix = '978';
        const group = Math.floor(Math.random() * 5) + 1;
        const publisher = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
        const book = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        const isbn = `${prefix}-${group}-${publisher}-${book}`;
        setFormData(prev => ({ ...prev, isbn }));
    };

    // Cloudinary upload function
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'bookverse_covers'); // Create this preset in Cloudinary

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleImageUpload = async (e, imageType) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadToCloudinary(file);
            setFormData(prev => ({
                ...prev,
                [imageType]: imageUrl
            }));
            setMessage({ type: 'success', text: `${imageType === 'coverImage' ? 'Front cover' : 'Back cover'} uploaded successfully!` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/admin/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    pages: parseInt(formData.pages),
                    rating: 4.5 // Default rating for new books
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Book added successfully!' });
                setFormData({
                    title: '',
                    author: '',
                    description: '',
                    category: '',
                    price: '',
                    pages: '',
                    isbn: '',
                    publishedDate: '',
                    coverImage: '',
                    backCoverImage: '',
                    publisher: '',
                    language: 'English',
                    format: 'Paperback'
                });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to add book' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error adding book' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Book</h2>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Book Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter book title"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author *
                        </label>
                        <select
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select an author</option>
                            {authors.map(author => (
                                <option key={author._id} value={author.name}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Can't find the author? <button type="button" onClick={() => document.querySelector('[data-tab="add-author"]').click()} className="text-blue-600 hover:underline">Add new author first</button>
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter book description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price ($) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="29.99"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pages
                        </label>
                        <input
                            type="number"
                            name="pages"
                            value={formData.pages}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="320"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ISBN
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="978-3-16-148410-0"
                            />
                            <button
                                type="button"
                                onClick={generateISBN}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Generate
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Published Date
                        </label>
                        <input
                            type="date"
                            name="publishedDate"
                            value={formData.publishedDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Publisher
                        </label>
                        <input
                            type="text"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Publisher name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                        </label>
                        <input
                            type="text"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="English"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Format
                        </label>
                        <select
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="Paperback">Paperback</option>
                            <option value="Hardcover">Hardcover</option>
                            <option value="E-book">E-book</option>
                            <option value="Audiobook">Audiobook</option>
                        </select>
                    </div>

                    {/* Image Uploads */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Front Cover Image *
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'coverImage')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                        {formData.coverImage && (
                            <img src={formData.coverImage} alt="Front cover" className="mt-2 w-32 h-40 object-cover rounded" />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Back Cover Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'backCoverImage')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                        {formData.backCoverImage && (
                            <img src={formData.backCoverImage} alt="Back cover" className="mt-2 w-32 h-40 object-cover rounded" />
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding Book...' : 'Add Book'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

// Add Author Form Component with Cloudinary upload
function AddAuthorForm() {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        website: '',
        email: '',
        photo: '',
        nationality: '',
        birthDate: '',
        awards: '',
        genres: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Cloudinary upload function for author photo
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'bookverse_authors'); // Create this preset in Cloudinary

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadToCloudinary(file);
            setFormData(prev => ({
                ...prev,
                photo: imageUrl
            }));
            setMessage({ type: 'success', text: 'Author photo uploaded successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/admin/authors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    awards: formData.awards ? formData.awards.split(',').map(award => award.trim()) : [],
                    genres: formData.genres ? formData.genres.split(',').map(genre => genre.trim()) : []
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Author added successfully!' });
                setFormData({
                    name: '',
                    bio: '',
                    website: '',
                    email: '',
                    photo: '',
                    nationality: '',
                    birthDate: '',
                    awards: '',
                    genres: ''
                });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to add author' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error adding author' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Author</h2>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter author name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Biography *
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter author biography"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="author@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://author-website.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nationality
                        </label>
                        <input
                            type="text"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="American, British, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Birth Date
                        </label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Awards (comma separated)
                        </label>
                        <input
                            type="text"
                            name="awards"
                            value={formData.awards}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Pulitzer Prize, Nobel Prize, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Genres (comma separated)
                        </label>
                        <input
                            type="text"
                            name="genres"
                            value={formData.genres}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Fiction, Mystery, Science Fiction"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author Photo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                        {formData.photo && (
                            <img src={formData.photo} alt="Author" className="mt-2 w-32 h-32 object-cover rounded-full" />
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding Author...' : 'Add Author'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

// Manage Books Component
function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('/api/admin/books');
            const data = await response.json();
            if (response.ok) {
                setBooks(data.books || []);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteBook = async (bookId) => {
        if (!confirm('Are you sure you want to delete this book?')) return;

        try {
            const response = await fetch(`/api/admin/books/${bookId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setBooks(books.filter(book => book._id !== bookId));
                alert('Book deleted successfully!');
            } else {
                alert('Failed to delete book');
            }
        } catch (error) {
            alert('Error deleting book');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading books...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Books</h2>

            {books.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No books found. Add some books to get started.
                </div>
            ) : (
                <div className="space-y-4">
                    {books.map(book => (
                        <div key={book._id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                {book.coverImage && (
                                    <img src={book.coverImage} alt={book.title} className="w-16 h-20 object-cover rounded" />
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-800">{book.title}</h3>
                                    <p className="text-gray-600 text-sm">by {book.author}</p>
                                    <p className="text-gray-500 text-sm">${book.price} • {book.category}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteBook(book._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

// Transactions Component
function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, purchase, borrow

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('/api/admin/transactions');
            const data = await response.json();
            if (response.ok) {
                setTransactions(data.transactions || []);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    });

    if (loading) {
        return <div className="text-center py-8">Loading transactions...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Transactions</option>
                    <option value="purchase">Purchases</option>
                    <option value="borrow">Borrows</option>
                </select>
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No transactions found.
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTransactions.map(transaction => (
                        <div key={transaction._id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{transaction.bookTitle}</h3>
                                    <p className="text-gray-600 text-sm">Transaction ID: {transaction.transactionId}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    transaction.type === 'purchase' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {transaction.type === 'purchase' ? 'Purchase' : 'Borrow'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <strong className="text-gray-700">Customer:</strong>
                                    <p className="text-gray-600">{transaction.customerName}</p>
                                </div>
                                <div>
                                    <strong className="text-gray-700">Amount:</strong>
                                    <p className="text-gray-600">${transaction.amount}</p>
                                </div>
                                <div>
                                    <strong className="text-gray-700">Date:</strong>
                                    <p className="text-gray-600">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <strong className="text-gray-700">Status:</strong>
                                    <p className={`font-medium ${
                                        transaction.status === 'completed' 
                                            ? 'text-green-600' 
                                            : 'text-yellow-600'
                                    }`}>
                                        {transaction.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}