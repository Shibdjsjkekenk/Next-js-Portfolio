import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ReduxProvider from "@/store/ReduxProvider";
import CurrentUser from "@/components/admin-view/CurrentUser";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Shubhanshu Tiwari Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mono.variable} min-h-screen w-full relative bg-white overflow-x-hidden`}
      >
        {/* Background */}
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
              radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
              radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)
            `,
            backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
          }}
        />

        <ReduxProvider>
          <CurrentUser />
          {children}
        </ReduxProvider>

        <ToastContainer position="top-right" autoClose={2000} theme="light" />
      </body>
    </html>
  );
}
