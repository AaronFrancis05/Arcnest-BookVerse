"use client";
// pages/index.js
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@components/MainLayout";
import BookCard from "@components/BookCard";
import CategoryFilter from "@components/CategoryFilter";
import BookScene from "@components/BookScene";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from database
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      const data = await response.json();
      if (response.ok) {
        setBooks(data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get 8 books from different categories
  const getFeaturedBooks = () => {
    const categories = [
      "fiction",
      "non-fiction",
      "science",
      "technology",
      "biography",
      "history",
      "fantasy",
      "mystery",
    ];
    const featuredBooks = [];
    const usedCategories = new Set();

    // Try to get one book from each category (up to 8 categories)
    for (const category of categories) {
      if (featuredBooks.length >= 8) break; // Changed to 8 books

      const bookInCategory = books.find(
        (book) => book.category === category && !usedCategories.has(category)
      );

      if (bookInCategory) {
        featuredBooks.push(bookInCategory);
        usedCategories.add(category);
      }
    }

    // If we don't have 8 books yet, fill with any available books
    if (featuredBooks.length < 8) {
      const remainingBooks = books.filter(
        (book) => !featuredBooks.includes(book)
      );
      featuredBooks.push(...remainingBooks.slice(0, 8 - featuredBooks.length));
    }

    return featuredBooks;
  };

  const featuredBooks = getFeaturedBooks();
  const filteredBooks =
    selectedCategory === "all"
      ? featuredBooks
      : featuredBooks.filter((book) => book.category === selectedCategory);

  // Remove the duplicate cart logic - BookCard now handles it directly
  const handleAddToCart = (book, type) => {
    console.log("Book added via parent:", book.title, type);
    // You can add any additional logic here if needed
    // But don't call addToCart again as BookCard already does it
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full h-[20vh] min-h-[300px] max-h-[500px] mx-auto mb-4 max-sm:mb-20 ">
        <BookScene />
      </div>

      <section className="text-center mb-12">
        <div className="h-50 mb-8"></div>

        <div className="relative p-1 rounded-2xl my-8 mx-auto max-w-2xl group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-yellow-400 via-blue-500 to-green-500 bg-[length:400%_100%] animate-gradient-border opacity-90"></div>
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
        categories={[
          /* { id: "all", name: "All Categories" }, */
          { id: "fiction", name: "Fiction" },
          { id: "non-fiction", name: "Non-Fiction" },
          { id: "science", name: "Science" },
          { id: "technology", name: "Technology" },
          { id: "biography", name: "Biography" },
          { id: "history", name: "History" },
          { id: "fantasy", name: "Fantasy" },
          { id: "mystery", name: "Mystery" },
        ]}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="w-full flex justify-center items-center px-4">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 w-full max-w-7xl mx-auto"
        >
          <AnimatePresence>
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onAddToCart={(book) => handleAddToCart(book, "purchase")}
                onBorrow={(book) => handleAddToCart(book, "borrow")}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No books found in this category.
          </p>
        </div>
      )}

      {/* Display message if we have fewer than 8 books */}
      {books.length > 0 && books.length < 8 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Showing {books.length} of 8 available books. Add more books to see
            the full collection.
          </p>
        </div>
      )}

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
  );
}
