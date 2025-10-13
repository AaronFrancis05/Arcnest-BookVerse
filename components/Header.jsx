'use client'
// components/Header.js
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBook, FiShoppingCart, FiUser, FiMail } from 'react-icons/fi';
import { useCart } from '@context/cartContext';

export default function Header() {
    const { cartItems } = useCart();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white shadow-lg sticky top-0 z-50"
        >
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-indigo-600">
                        <FiBook className="text-3xl" />
                        <span>Arcnest BookVerse</span>
                    </Link>

                    <div className="flex space-x-6">
                        <Link href="/" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                            <FiBook />
                            <span>Books</span>
                        </Link>
                        <Link href="/about" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                            <FiUser />
                            <span>About</span>
                        </Link>
                        <Link href="/contact" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                            <FiMail />
                            <span>Contact</span>
                        </Link>
                        <Link href="/cart" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors relative">
                            <FiShoppingCart />
                            <span>Cart</span>
                            {cartItems.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                    {cartItems.length}
                                </motion.span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </motion.header>
    );
}