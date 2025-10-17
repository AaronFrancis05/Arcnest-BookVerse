// components/Header.js
'use client'
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBook,
    FiShoppingCart,
    FiUser,
    FiMail,
    FiMenu,
    FiX,
    FiLogIn,
    FiLogOut
} from 'react-icons/fi';
import { useCart } from '@context/cartContext';
import { useState } from 'react';
import {
    SignedIn,
    SignedOut,
    UserButton,
    useUser
} from '@clerk/nextjs';

export default function Header() {
    const { cartItems } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useUser();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white shadow-lg sticky top-0 z-50"
        >
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-indigo-600"
                        onClick={closeMobileMenu}
                    >
                        <FiBook className="text-2xl md:text-3xl" />
                        <span className="hidden sm:inline">Arcnest BookVerse</span>
                        <span className="sm:hidden">BookVerse</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                            <FiBook className="text-lg" />
                            <span>Books</span>
                        </Link>
                        <Link href="/about" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                            <FiUser className="text-lg" />
                            <span>About</span>
                        </Link>
                        <Link href="/contact" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                            <FiMail className="text-lg" />
                            <span>Contact</span>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors relative">
                            <FiShoppingCart className="text-lg" />
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

                        {/* Authentication */}
                        <SignedOut>
                            <Link
                                href="/sign-in"
                                className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <FiLogIn className="text-lg" />
                                <span>Sign In</span>
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <div className="flex items-center space-x-4">
                                {/* <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                                >
                                    <FiUser className="text-lg" />
                                    <span>Dashboard</span>
                                </Link> */}
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                    </div>

                    {/* Mobile Navigation Button */}
                    <div className="flex md:hidden items-center space-x-4">
                        <Link href="/cart" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors relative p-2">
                            <FiShoppingCart className="text-xl" />
                            {cartItems.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                >
                                    {cartItems.length}
                                </motion.span>
                            )}
                        </Link>

                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>

                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-4 border-t border-gray-200 mt-4">
                                <Link
                                    href="/"
                                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-lg font-medium"
                                    onClick={closeMobileMenu}
                                >
                                    <FiBook className="text-xl" />
                                    <span>Books</span>
                                </Link>
                                <Link
                                    href="/about"
                                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-lg font-medium"
                                    onClick={closeMobileMenu}
                                >
                                    <FiUser className="text-xl" />
                                    <span>About</span>
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-lg font-medium"
                                    onClick={closeMobileMenu}
                                >
                                    <FiMail className="text-xl" />
                                    <span>Contact</span>
                                </Link>

                                {/* <SignedIn>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-lg font-medium"
                                        onClick={closeMobileMenu}
                                    >
                                        <FiUser className="text-xl" />
                                        <span>Dashboard</span>
                                    </Link>
                                </SignedIn> */}

                                <SignedOut>
                                    <Link
                                        href="/sign-in"
                                        className="flex items-center space-x-3 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
                                        onClick={closeMobileMenu}
                                    >
                                        <FiLogIn className="text-xl" />
                                        <span>Sign In</span>
                                    </Link>
                                </SignedOut>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
}