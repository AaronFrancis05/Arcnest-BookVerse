// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@context/cartContext";
import MinimalFooter from "@components/MinimalFooter";
import PageLoader from "@/components/Loader/PageLoader";
import { ClerkProvider } from "@clerk/nextjs";
// import { useSyncUser } from "@hooks/useSyncUser";
import UserSync from "@components/UserSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ARCNEST 3D BOOKVERSE",
  description: "Arcnest BookVerse delivers atmost top quality books.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#4f46e5", // indigo-600
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PageLoader />
          <CartProvider>
            {/* <useSyncUser /> */}
            <UserSync />

            {children}
            <MinimalFooter />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
