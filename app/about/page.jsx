'use client'
// pages/about.js
import { motion } from 'framer-motion';
import Layout from '@components/MainLayout';
import { FiUsers, FiAward, FiBook } from 'react-icons/fi';

export default function About() {
    const features = [
        {
            icon: <FiBook className="text-3xl" />,
            title: "Extensive Collection",
            description: "Over 10,000 books across various genres and categories"
        },
        {
            icon: <FiUsers className="text-3xl" />,
            title: "Community Driven",
            description: "Join our community of book lovers and share your reviews"
        },
        {
            icon: <FiAward className="text-3xl" />,
            title: "Award Winning",
            description: "Recognized as the best digital library platform 2024"
        }
    ];

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">About BookVerse</h1>
                    <p className="text-xl text-gray-600">
                        Revolutionizing the way you discover and experience books
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                    <p className="text-gray-700 leading-relaxed">
                        BookVerse was founded in 2020 with a simple mission: to make reading more accessible
                        and engaging through technology. We combine the timeless joy of reading with cutting-edge
                        3D visualization to create an immersive library experience.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-6 text-center"
                        >
                            <div className="text-indigo-600 mb-4 flex justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}