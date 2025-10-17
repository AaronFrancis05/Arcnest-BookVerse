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
      {/* <Suspense fallback={<ThreeDSkeletonLoader />}> */}
        <Layout>
          <div className="w-full h-[20vh] min-h-[300px] max-h-[500px] mx-auto mb-4">
            <BookScene />
          </div>
          {/* Hero Section with 3D Book */}

          <section className="text-center mb-12">
            <div className="h-64 mb-8"></div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-gray-800 mb-4"
            >
              Welcome to BookVerse
            </motion.h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your next favorite book in our extensive 3D library
              collection
            </p>
          </section>

          {/* Category Filter */}
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
        </Layout>
      {/* </Suspense> */}
    </>
  );
}
