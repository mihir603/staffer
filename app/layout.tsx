import type { Metadata } from "next";
import {Inter} from "next/font/google"
import "./globals.css";
import {Toaster} from "react-hot-toast"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Staffer",
  description: "A modern employee management app built in Next.JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Toaster position="top-right"/>
        {children}
      </body>
    </html>
  );
}
