// NAVIGATION BAR COMPONENT
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
    FiHome,
    FiSettings,
    FiHelpCircle,
    // --- NEW IMPORTS FOR DROPDOWN ---
    FiChevronDown,
    FiChevronUp,
} from 'react-icons/fi';
import { useCart } from '@context/cartContext';
import { useState, useEffect } from 'react';
import {
    SignedIn,
    SignedOut,
    UserButton,
    useUser
} from '@clerk/nextjs';

export default function Navigation() {
    const { cartItems = [] } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
    
    // --- NEW STATE FOR BOOK DROPDOWN ---
    const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);

    // Check admin status when user loads
    useEffect(() => {
        if (isLoaded && user) {
            checkAdminStatus();
        } else {
            setIsAdmin(false);
        }
    }, [user, isLoaded]);

    const checkAdminStatus = async () => {
        if (isCheckingAdmin) return;

        setIsCheckingAdmin(true);
        try {
            const response = await fetch('/api/admin/check-status');
            if (response.ok) {
                const data = await response.json();
                setIsAdmin(data.isAdmin);
            } else {
                console.error('Failed to check admin status:', response.status);
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        } finally {
            setIsCheckingAdmin(false);
        }
    };

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Ensure book dropdown is closed when opening/closing main mobile menu
        setIsBookDropdownOpen(false); 
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsBookDropdownOpen(false); // Close dropdown when main mobile menu closes
    };

    const toggleBookDropdown = () => {
        setIsBookDropdownOpen(!isBookDropdownOpen);
    };
    
    // Safe calculation with array check
    const totalCartItems = Array.isArray(cartItems)
        ? cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
        : 0;

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
                : 'bg-white shadow-sm'
                }`}
        >
            <nav className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        onClick={closeMobileMenu}
                    >
                        <FiBook className="text-2xl md:text-3xl" />
                        <span className="hidden sm:inline">Arcnest BookVerse</span>
                        <span className="sm:hidden">BookVerse</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="flex items-center space-x-1 hover:text-indigo-600 transition-colors group px-3 py-2 rounded-lg hover:bg-gray-50"
                        >
                            <FiHome className="text-lg group-hover:scale-110 transition-transform" />
                            <span>Home</span>
                        </Link>
                        
                        {/* --- BOOK DROPDOWN FOR DESKTOP --- */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsBookDropdownOpen(true)}
                            onMouseLeave={() => setIsBookDropdownOpen(false)}
                        >
                            <button
                                onClick={toggleBookDropdown}
                                className="flex items-center space-x-1 hover:text-indigo-600 transition-colors group px-3 py-2 rounded-lg hover:bg-gray-50 focus:outline-none"
                            >
                                <FiBook className="text-lg group-hover:scale-110 transition-transform" />
                                <span>Book</span>
                                {isBookDropdownOpen ? (
                                    <FiChevronUp className="text-gray-500 w-4 h-4" />
                                ) : (
                                    <FiChevronDown className="text-gray-500 w-4 h-4" />
                                )}
                            </button>

                            {/* Dropdown Content */}
                            <AnimatePresence>
                                {isBookDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-20 p-1 origin-top-left"
                                        onClick={() => setIsBookDropdownOpen(false)} // Close on click inside
                                    >
                                        <Link
                                            href="/books"
                                            className="flex items-center w-full p-2 text-gray-700 hover:bg-indigo-50 rounded-md transition-colors text-base font-normal"
                                        >
                                            All Books
                                        </Link>
                                        <Link
                                            href="/books"
                                            className="flex items-center w-full p-2 text-gray-700 hover:bg-indigo-50 rounded-md transition-colors text-base font-normal"
                                        >
                                            Browse Genres
                                        </Link>
                                        <Link
                                            href="/books"
                                            className="flex items-center w-full p-2 text-gray-700 hover:bg-indigo-50 rounded-md transition-colors text-base font-normal"
                                        >
                                            New Releases
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* --- END BOOK DROPDOWN FOR DESKTOP --- */}


                        <Link
                            href="/about"
                            className="flex items-center space-x-1 hover:text-indigo-600 transition-colors group px-3 py-2 rounded-lg hover:bg-gray-50"
                        >
                            <FiUser className="text-lg group-hover:scale-110 transition-transform" />
                            <span>About</span>
                        </Link>
                        <Link
                            href="/faq"
                            className="flex items-center space-x-1 hover:text-indigo-600 transition-colors group px-3 py-2 rounded-lg hover:bg-gray-50"
                        >
                            <FiHelpCircle className="text-lg group-hover:scale-110 transition-transform" />
                            <span>FAQ</span>
                        </Link>

                        <Link
                            href="/contact"
                            className="flex items-center space-x-1 hover:text-indigo-600 transition-colors group px-3 py-2 rounded-lg hover:bg-gray-50"
                        >
                            <FiMail className="text-lg group-hover:scale-110 transition-transform" />
                            <span>Contact</span>
                        </Link>

                        {/* Cart with improved badge */}
                        <Link
                            href="/cart"
                            className="flex items-center space-x-1 hover:text-indigo-600 transition-colors relative group px-3 py-2 rounded-lg hover:bg-gray-50"
                        >
                            <FiShoppingCart className="text-lg group-hover:scale-110 transition-transform" />
                            <span>Cart</span>
                            {totalCartItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shadow-sm"
                                >
                                    {totalCartItems > 9 ? '9+' : totalCartItems}
                                </motion.span>
                            )}
                        </Link>

                        {/* Authentication */}
                        <SignedOut>
                            <Link
                                href="/sign-in"
                                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FiLogIn className="text-lg" />
                                <span>Sign In</span>
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <div className="flex items-center space-x-4">
                                {/* User welcome message */}
                                <div className="hidden lg:flex flex-col text-right">
                                    <span className="text-sm font-medium text-gray-700">
                                        Welcome back
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {user?.firstName || user?.username}
                                    </span>
                                </div>

                                <CustomUserButton isAdmin={isAdmin} />
                            </div>
                        </SignedIn>
                    </div>

                    {/* Mobile Navigation Button */}
                    <div className="flex md:hidden items-center space-x-3">
                        {/* Cart for mobile */}
                        <Link
                            href="/cart"
                            className="flex items-center hover:text-indigo-600 transition-colors relative p-2 rounded-lg hover:bg-gray-50"
                            onClick={closeMobileMenu} // Add this to close menu if cart is clicked
                        >
                            <FiShoppingCart className="text-xl" />
                            {totalCartItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-semibold"
                                >
                                    {totalCartItems > 9 ? '9+' : totalCartItems}
                                </motion.span>
                            )}
                        </Link>

                        <SignedIn>
                            <CustomUserButton isAdmin={isAdmin} />
                        </SignedIn>

                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="text-xl" />
                            ) : (
                                <FiMenu className="text-xl" />
                            )}
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
                            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-200 mt-3 rounded-lg shadow-lg"
                        >
                            <div className="py-4 space-y-2">
                                <Link
                                    href="/"
                                    className="flex items-center space-x-3 p-3 hover:bg-indigo-50 rounded-lg transition-colors text-lg font-medium group"
                                    onClick={closeMobileMenu}
                                >
                                    <FiHome className="text-xl text-indigo-600 group-hover:scale-110 transition-transform" />
                                    <span>Home</span>
                                </Link>

                                {/* --- BOOK DROPDOWN FOR MOBILE MENU --- */}
                                <div className="relative">
                                    <button
                                        onClick={toggleBookDropdown}
                                        className="flex items-center space-x-3 p-3 hover:bg-indigo-50 rounded-lg transition-colors text-lg font-medium group w-full text-left"
                                    >
                                        <FiBook className="text-xl text-indigo-600 group-hover:scale-110 transition-transform" />
                                        <span>Book</span>
                                        {isBookDropdownOpen ? (
                                            <FiChevronUp className="text-gray-500 w-5 h-5 ml-auto" />
                                        ) : (
                                            <FiChevronDown className="text-gray-500 w-5 h-5 ml-auto" />
                                        )}
                                    </button>
                                    
                                    {/* Mobile Dropdown Content */}
                                    <AnimatePresence>
                                        {isBookDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="pl-12 pr-4 py-1 bg-gray-50 rounded-b-lg overflow-hidden"
                                            >
                                                <Link
                                                    href="/books"
                                                    className="block p-2 text-gray-700 hover:bg-indigo-100 rounded-md transition-colors text-base"
                                                    onClick={closeMobileMenu}
                                                >
                                                    All Books
                                                </Link>
                                                <Link
                                                    href="/books"
                                                    className="block p-2 text-gray-700 hover:bg-indigo-100 rounded-md transition-colors text-base"
                                                    onClick={closeMobileMenu}
                                                >
                                                    Browse Genres
                                                </Link>
                                                <Link
                                                    href="/books"
                                                    className="block p-2 text-gray-700 hover:bg-indigo-100 rounded-md transition-colors text-base"
                                                    onClick={closeMobileMenu}
                                                >
                                                    New Releases
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {/* --- END BOOK DROPDOWN FOR MOBILE MENU --- */}


                                <Link
                                    href="/about"
                                    className="flex items-center space-x-3 p-3 hover:bg-indigo-50 rounded-lg transition-colors text-lg font-medium group"
                                    onClick={closeMobileMenu}
                                >
                                    <FiUser className="text-xl text-indigo-600 group-hover:scale-110 transition-transform" />
                                    <span>About</span>
                                </Link>
                                <Link
                                    href="/faq"
                                    className="flex items-center space-x-3 p-3 hover:bg-indigo-50 rounded-lg transition-colors text-lg font-medium group"
                                    onClick={closeMobileMenu}
                                >
                                    <FiHelpCircle className="text-xl text-indigo-600 group-hover:scale-110 transition-transform" />
                                    <span>FAQ</span>
                                </Link>

                                <Link
                                    href="/contact"
                                    className="flex items-center space-x-3 p-3 hover:bg-indigo-50 rounded-lg transition-colors text-lg font-medium group"
                                    onClick={closeMobileMenu}
                                >
                                    <FiMail className="text-xl text-indigo-600 group-hover:scale-110 transition-transform" />
                                    <span>Contact</span>
                                </Link>

                                <SignedOut>
                                    <div className="pt-2 border-t border-gray-200">
                                        <Link
                                            href="/sign-in"
                                            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-lg font-medium justify-center"
                                            onClick={closeMobileMenu}
                                        >
                                            <FiLogIn className="text-xl" />
                                            <span>Sign In</span>
                                        </Link>
                                    </div>
                                </SignedOut>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
}

// Fixed Custom UserButton Component
function CustomUserButton({ isAdmin }) {
    return (
        <UserButton
            afterSignOutUrl="/"
            appearance={{
                elements: {
                    avatarBox: "w-10 h-10 border-2 border-indigo-100 hover:border-indigo-300 transition-colors",
                }
            }}
        >
            <UserButton.MenuItems>
                
                {/* Conditional admin link */}
                {isAdmin && (
                    <UserButton.Link
                        label="Admin Dashboard"
                        href="/admin"
                        labelIcon={<FiSettings className="w-4 h-4" />}
                    />
                )}
            </UserButton.MenuItems>
        </UserButton>
    );
}