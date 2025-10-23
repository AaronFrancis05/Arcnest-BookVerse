'use client'
// components/BookCard.js
import { motion } from 'framer-motion';
import { FiShoppingCart, FiBookOpen } from 'react-icons/fi';
import { useCart } from '@context/cartContext';

export default function BookCard({ book, onAddToCart, onBorrow }) {
    const { addToCart } = useCart();

    const handleAddToCart = (type) => {
        console.log(`Adding ${book.title} to cart as ${type}`);

        // Only call addToCart once
        addToCart({
            ...book,
            type: type
        });

        // Optional: Call the parent functions for any additional logic
        // But remove the duplicate cart adding logic from the parent
        if (type === 'purchase' && onAddToCart) {
            onAddToCart(book);
        } else if (type === 'borrow' && onBorrow) {
            onBorrow(book);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 w-full max-w-sm mx-auto"
        >
            {/* Book cover */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                <div className="text-white text-center p-4 z-10">
                    <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                    <p className="text-blue-100">{book.author}</p>
                </div>
            </div>

            {/* Book info */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 mr-3">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                            {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 truncate">by {book.author}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                        {book.category}
                    </span>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="text-left">
                        <div className="text-2xl font-bold text-gray-900">
                            ${book.price}
                        </div>
                        <div className="text-green-600 text-sm font-medium">
                            Borrow: ${book.borrowPrice || 5}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-yellow-500 text-sm flex items-center gap-1">
                            <span>⭐</span>
                            <span>{book.rating}</span>
                        </div>
                        <div className="text-gray-500 text-xs">{book.pages} pages</div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart('purchase')}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                        <FiShoppingCart className="text-lg" />
                        <span>Buy</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart('borrow')}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                        <FiBookOpen className="text-lg" />
                        <span>Borrow</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}