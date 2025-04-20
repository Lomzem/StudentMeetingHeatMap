import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./_components/Header";
import { Providers } from "./providers"; // Import Providers component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Heatmap",
  description: "Visualize student activity with interactive mapping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap entire app in Providers to include QueryClientProvider */}
        <Providers>
          <div className="flex flex-col h-dvh">
            <Header />
            <div className="flex-[1]">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
