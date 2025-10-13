// components/BookCard.js
import { motion } from 'framer-motion';
import { FiShoppingCart, FiBookOpen } from 'react-icons/fi';
import { useCart } from '@context/cartContext';

export default function BookCard({ book }) {
    const { addToCart } = useCart();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                        <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                        <p className="text-sm opacity-90">{book.author}</p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">{book.category}</span>
                    <div className="text-right">
                        <div className="text-lg font-bold text-indigo-600">${book.price}</div>
                        <div className="text-sm text-green-600">Borrow: ${book.borrowPrice || 5}</div>
                    </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{book.description}</p>

                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(book, 'purchase')}
                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors"
                    >
                        <FiShoppingCart />
                        <span>Buy</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(book, 'borrow')}
                        className="flex-1 border border-indigo-600 text-indigo-600 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-50 transition-colors"
                    >
                        <FiBookOpen />
                        <span>Borrow</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}