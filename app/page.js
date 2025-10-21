'use client';
// pages/index.js
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
//import { Canvas } from "@react-three/fiber";
import Layout from "@components/MainLayout";
import BookCard from "@components/BookCard";
import CategoryFilter from "@components/CategoryFilter";
//import ThreeDBook from "@components/3DBook";
import { books, categories } from "@lib/data";
import BookScene from "@components/BookScene"; // Import your BookScene component
import DiveDeeperButton from "@components/GoogleButton";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);

  const filteredBooks =
    selectedCategory === "all"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  const addToCart = (book) => {
    setCart((prev) => [...prev, { ...book, type: "purchase" }]);
  };

  const borrowBook = (book) => {
    setCart((prev) => [...prev, { ...book, type: "borrow" }]);
  };

  return (
    <>
      {/* Hero Section with 3D Book */}
      <Layout>
        <div className="w-full h-[20vh] min-h-[300px] max-h-[500px] mx-auto mb-4">
          <BookScene />
        </div>

        <section className="text-center mb-12">
          <div className="h-50 mb-8"></div>

          {/* Enhanced Gradient Border Container */}
          <div className="relative p-1 rounded-2xl my-8 mx-auto max-w-2xl group">
            {/* Animated gradient background for the border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-yellow-400 via-blue-500 to-green-500 bg-[length:400%_100%] animate-gradient-border opacity-90"></div>

            {/* Inner background - creates the border illusion */}
            <div className="relative rounded-xl bg-white p-8 backdrop-blur-sm">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold text-transparent mb-4 bg-gradient-to-r from-red-600 via-yellow-500 via-blue-600 to-green-600 bg-clip-text bg-[length:400%_100%] animate-gradient-text"
              >
                Welcome to BookVerse
              </motion.h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover your next favorite book in our extensive 3D library
                collection
              </p>
            </div>
          </div>
        </section>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        {/* Books Grid - Perfectly Centered */}
        <div className="w-full flex justify-center items-center px-4 ">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
            style={{
              display: "grid",
              justifyItems: "center",
              alignItems: "start",
              justifyContent: "center",
            }}
          >
            <AnimatePresence>
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddToCart={addToCart}
                  onBorrow={borrowBook}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
        <style jsx global>{`
          @keyframes gradient-border {
            0% {
              background-position: 0% 50%;
            }
            25% {
              background-position: 50% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            75% {
              background-position: 150% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }

          @keyframes gradient-text {
            0% {
              background-position: 0% 50%;
            }
            25% {
              background-position: 50% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            75% {
              background-position: 150% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }

          .animate-gradient-border {
            animation: gradient-border 6s ease infinite;
            background-size: 400% 100%;
          }

          .animate-gradient-text {
            animation: gradient-text 8s ease infinite;
            background-size: 400% 100%;
          }
        `}</style>
      </Layout>
      {/* </Suspense> */}
    </>
  );
}
