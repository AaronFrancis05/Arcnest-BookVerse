// components/Footer.jsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MinimalFooter = () => {
    const currentYear = new Date().getFullYear();

    const footerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={footerVariants}
            className="bg-gray-800 text-white mt-20 border-t border-gray-700"
        >
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="mb-4"
                        >
                            <h3 className="text-2xl font-bold text-gray-100">BookVerse</h3>
                            <p className="text-indigo-400 text-sm mt-1">3D Library Experience</p>
                        </motion.div>
                        <p className="text-gray-400 mb-4 leading-relaxed">
                            Discover your next favorite book in our immersive 3D library collection.
                            Read, explore, and interact with stories like never before.
                        </p>
                        <div className="flex space-x-3">
                            {[
                                { name: 'twitter', color: 'hover:bg-blue-500' },
                                { name: 'github', color: 'hover:bg-gray-600' },
                                { name: 'linkedin', color: 'hover:bg-blue-600' },
                                { name: 'instagram', color: 'hover:bg-pink-500' }
                            ].map((social) => (
                                <motion.a
                                    key={social.name}
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    href="#"
                                    className={`w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center ${social.color} transition-colors duration-200`}
                                >
                                    <span className="sr-only">{social.name}</span>
                                    <div className="w-4 h-4 bg-gray-300 rounded-sm opacity-80"></div>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-100">Explore</h4>
                        <ul className="space-y-3">
                            {[
                                '3D Book Collection',
                                'Featured Books',
                                'New Arrivals',
                                'Best Sellers',
                                'Interactive Stories'
                            ].map((item) => (
                                <motion.li key={item} whileHover={{ x: 5 }}>
                                    <Link
                                        href="#"
                                        className="text-gray-400 hover:text-indigo-300 transition-colors duration-200 flex items-center"
                                    >
                                        <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3"></span>
                                        {item}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-100">Categories</h4>
                        <ul className="space-y-3">
                            {[
                                'Science Fiction',
                                'Technology',
                                'Fantasy',
                                'Mystery',
                                'Biography',
                                'Children Books'
                            ].map((category) => (
                                <motion.li key={category} whileHover={{ x: 5 }}>
                                    <Link
                                        href="#"
                                        className="text-gray-400 hover:text-indigo-300 transition-colors duration-200 flex items-center"
                                    >
                                        <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3"></span>
                                        {category}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-100">Support</h4>
                        <ul className="space-y-3 mb-6">
                            {[
                                'Help Center',
                                'Contact Us',
                                'Shipping Info',
                                'Returns Policy',
                                'Privacy Policy',
                                'Terms of Service'
                            ].map((item) => (
                                <motion.li key={item} whileHover={{ x: 5 }}>
                                    <Link
                                        href="#"
                                        className="text-gray-400 hover:text-indigo-300 transition-colors duration-200 text-sm"
                                    >
                                        {item}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Contact Info */}
                        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                            <p className="text-sm text-gray-300 mb-2">Get in touch</p>
                            <div className="space-y-2 text-sm text-gray-400">
                                <p>aarontaremwa8@gmail.com</p>
                                <p>+256 744 838323</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
                >
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        © {currentYear} BookVerse. All rights reserved.
                    </p>

                    <div className="flex items-center space-x-6 text-sm">
                        <span className="text-gray-400">Powered by</span>
                        <div className="flex items-center space-x-4">
                            <span className="text-indigo-300 font-medium">Next.js</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-indigo-300 font-medium">Three.js</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-indigo-300 font-medium">Framer Motion</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default MinimalFooter;