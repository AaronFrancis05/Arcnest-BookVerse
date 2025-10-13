// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@context/cartContext";
import MinimalFooter from "@components/MinimalFooter";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "ARCNEST 3D BOOKVERSE",
  description: "Arcnest BookVerse delivers atmost top quality books.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
          <MinimalFooter />
        </CartProvider>
      </body>
    </html>
  );
}
