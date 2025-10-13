// lib/data.js
export const categories = [
  "all",
  "fiction",
  "non-fiction",
  "science",
  "technology",
  "history",
  "biography",
];

export const books = [
  {
    id: 1,
    title: "The Great Adventure",
    author: "John Smith",
    category: "fiction",
    price: 24.99,
    borrowPrice: 3.99,
    description:
      "An epic journey through mystical lands and ancient civilizations.",
  },
  {
    id: 2,
    title: "Quantum Physics",
    author: "Dr. Emily Chen",
    category: "science",
    price: 34.99,
    borrowPrice: 5.99,
    description:
      "Understanding the fundamental principles of quantum mechanics.",
  },
  {
    id: 3,
    title: "Digital Revolution",
    author: "Mike Johnson",
    category: "technology",
    price: 29.99,
    borrowPrice: 4.99,
    description: "How technology is transforming our world and future.",
  },
  {
    id: 4,
    title: "Digital Evolution",
    author: "Jayce Robinson",
    category: "history",
    price: 20.99,
    borrowPrice: 6.99,
    description: "How technology is evolving our world and future.",
  },
  // Add more books as needed
];
