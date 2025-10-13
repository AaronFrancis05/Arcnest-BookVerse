'use client'
import { motion } from "framer-motion";
import Header from "@components/Header";

import React from 'react'

const Layout = ({children}) => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Header />
          <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-4 py-8"
          >
              {children}
          </motion.main>
      </div>
  )
}

export default Layout
