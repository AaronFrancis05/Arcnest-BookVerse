// components/Loader/PageLoader.jsx
'use client'
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Simplified loading steps - fewer and shorter durations
    const loadingSteps = [
        { text: "Initializing BookVerse...", duration: 400 },
        { text: "Loading Libraries...", duration: 500 },
        { text: "Almost Ready...", duration: 300 }
    ];

    useEffect(() => {
        let progressInterval;
        let stepTimeout;
        let currentStep = 0;

        const updateProgress = () => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => setIsLoading(false), 300); // Reduced from 800ms
                    return 100;
                }
                // Faster progress increments
                const increment = 2 + (Math.random() * 1); // Increased from 0.5-0.8
                return Math.min(prev + increment, 100);
            });
        };

        const runLoadingSequence = () => {
            // Faster progress interval
            progressInterval = setInterval(updateProgress, 20); // Reduced from 30ms

            // Cycle through loading steps
            const cycleSteps = () => {
                currentStep = (currentStep + 1) % loadingSteps.length;
                stepTimeout = setTimeout(cycleSteps, loadingSteps[currentStep].duration);
            };

            stepTimeout = setTimeout(cycleSteps, loadingSteps[0].duration);
        };

        // Shorter initial delay
        const startTimeout = setTimeout(runLoadingSequence, 200); // Reduced from 500ms

        // Alternative: Force complete after maximum 3 seconds as fallback
        const safetyTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(stepTimeout);
            clearTimeout(startTimeout);
            clearTimeout(safetyTimeout);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }} // Start immediately visible
                exit={{
                    opacity: 0,
                    transition: { duration: 0.4, ease: "easeInOut" } // Faster exit
                }}
                className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900"
            >
                {/* Simplified Background - removed complex animations */}
                <div className="absolute inset-0 opacity-30">
                    {/* Minimal geometric pattern */}
                    <div className="absolute top-1/4 left-1/4 w-20 h-20 border border-white rounded-lg transform rotate-45"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border border-white rounded-full"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }} // Faster animation
                        className="text-center max-w-md mx-auto px-6"
                    >
                        {/* Simplified Brand Logo */}
                        <div className="mb-6">
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.02, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                                >
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                </motion.div>
                            </div>

                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                Arcnest BookVerse
                            </h1>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-4">
                            {/* Progress Bar - Optional: Uncomment if needed */}
                            {/* <div className="space-y-2">
                                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-300">
                                    <span>Loading...</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                            </div> */}

                            {/* Loading Dots */}
                            <div className="flex justify-center space-x-1">
                                {[0, 1, 2].map((dot) => (
                                    <motion.div
                                        key={dot}
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.3, 1, 0.3]
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            delay: dot * 0.2
                                        }}
                                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}