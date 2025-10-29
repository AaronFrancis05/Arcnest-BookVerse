// FREQUENTLY ASKED QUESTIONS (FAQ) SECTION COMPONENT
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@components/MainLayout'; // Import Layout

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What is BookVerse?",
            answer: "BookVerse is an immersive 3D digital library platform that allows you to explore, purchase, and borrow books in an interactive virtual environment. Experience books like never before with our 3D visualization technology."
        },
        {
            question: "How does the borrowing system work?",
            answer: "You can borrow books for a period of 14 days. Simply click the 'Borrow' button on any available book. You'll need to have an active account and return the book before the due date to avoid late fees."
        },
        {
            question: "Can I purchase books permanently?",
            answer: "Yes! Many books in our collection are available for purchase. When you buy a book, you get permanent access to the digital copy that you can read on any device through our platform."
        },
        {
            question: "What devices are supported?",
            answer: "BookVerse works on all modern devices including desktop computers, laptops, tablets, and smartphones. For the best 3D experience, we recommend using a device with WebGL support."
        },
        {
            question: "Is there a membership fee?",
            answer: "Basic access to BookVerse is free! You can browse our library and read sample chapters. Premium features like extended borrowing, exclusive content, and enhanced 3D experiences require a subscription."
        },
        {
            question: "How do I return borrowed books?",
            answer: "Borrowed books are automatically returned on their due date. You can also manually return them earlier through your dashboard to free up your borrowing limit."
        },
        {
            question: "Can I suggest books to be added?",
            answer: "Absolutely! We welcome book suggestions from our community. Use the 'Suggest a Book' feature in your account settings, and our team will review your recommendation."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and various digital payment methods. All transactions are secured with SSL encryption for your safety."
        },
        {
            question: "How does the 3D book experience work?",
            answer: "Our 3D books use WebGL technology to create interactive book models. You can rotate, zoom, and virtually 'flip through' pages to get a realistic reading experience before committing to purchase or borrow."
        },
        {
            question: "Is my reading progress saved across devices?",
            answer: "Yes! Your reading progress, bookmarks, and notes are automatically synced across all your devices when you're signed into your BookVerse account."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <Layout> {/* Wrap with Layout component */}
            <section className="w-full max-w-4xl mx-auto py-16 px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find quick answers to common questions about BookVerse.
                        Can't find what you're looking for? Contact our support team.
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                            >
                                <span className="text-lg font-semibold text-gray-800 pr-4">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0"
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-4">
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Still have questions?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Our support team is here to help you get the most out of BookVerse.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                            Contact Support
                        </button>
                        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                            Visit Help Center
                        </button>
                    </div>
                </motion.div>
            </section>
        </Layout>
    );
};

export default FAQSection;