"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
  FaGlobe,
} from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  /*  Lock scroll when mobile menu open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-white to-[#e6e6f3d9]">
        <div className="max-w-7xl mx-auto px-4 h-16 relative flex items-center sm:px-6 lg:px-8">
          {/* LEFT - LOGO */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/assets/logo.png"
                alt="logo"
                width={144}
                height={48}
                priority
              />
            </Link>
          </div>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center text-[17px] gap-10">
            <Link href="/" className="font-bold hover:text-red-600">
              Home
            </Link>

            <Link href="#about-us" className="font-bold hover:text-red-600 text-[17px]">
              About Us
            </Link>

            <div className="relative">
              <Link href="#services" className="font-bold hover:text-red-600 text-[17px]">
                My Expertise
              </Link>
              <span className="absolute -top-3 -right-4 bg-red-600 text-white text-[10px] px-2 rounded-full">
                New
              </span>
            </div>

            <Link href="/contact" className="font-bold hover:text-red-600 text-[17px]">
              Contact Us
            </Link>
          </div>

          {/* RIGHT - BUTTON */}
          <div className="ml-auto hidden md:block">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-[18px] font-medium transition-transform transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-[#6A38C2] disabled:pointer-events-none disabled:opacity-50 text-white px-4 py-2 rounded-full bg-[#6A38C2] w-full max-w-[150px] shadow-[0px_4px_8px_rgba(0,0,0,0.3),inset_0px_-2px_4px_rgba(255,255,255,0.3)] hover:shadow-[0px_6px_12px_rgba(0,0,0,0.4),inset_0px_-4px_6px_rgba(255,255,255,0.4)] h-[40px]"
            >
              <FiLogIn size={18} />
              Login
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(true)}
            className="ml-auto md:hidden text-3xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* ================= FULL SCREEN MOBILE MENU ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[99999] bg-white flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* CLOSE */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-3xl"
            >
              ✕
            </button>

            {/* MENU ITEMS */}
            <motion.div
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.2 } },
              }}
              className="flex flex-col items-end gap-10 w-full pr-8 mb-0"
            >
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "#about-us" },
                { name: "My Expertise", href: "#services" },
                { name: "Contact Us", href: "/contact" },
              ].map((item) => (
                <motion.div
                  key={item.name}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-bold hover:text-[#6A38C2]"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* MOBILE LOGIN BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-28 right-8 flex justify-end"
            >
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-[18px] font-medium transition-transform transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-[#6A38C2] disabled:pointer-events-none disabled:opacity-50 text-white px-5 py-2 rounded-full bg-[#6A38C2] shadow-[0px_4px_8px_rgba(0,0,0,0.3),inset_0px_-2px_4px_rgba(255,255,255,0.3)] hover:shadow-[0px_6px_12px_rgba(0,0,0,0.4),inset_0px_-4px_6px_rgba(255,255,255,0.4)] h-[44px]"
              >
                <FiLogIn size={18} />
                Login
              </Link>
            </motion.div>

            {/* SOCIAL ICONS (BOTTOM) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 right-8 flex justify-end gap-5"
            >
              {[
                {
                  href: "https://www.facebook.com/shubhanshu.tiwari.167",
                  icon: <FaFacebookF className="text-blue-600" />,
                },
                {
                  href: "https://www.instagram.com/phenomenalllt",
                  icon: <FaInstagram className="text-pink-500" />,
                },
                {
                  href: "https://github.com/Shibdjsjkekenk",
                  icon: <FaGithub className="text-gray-800" />,
                },
                {
                  href: "https://www.linkedin.com/in/tiwari-shubhanshu-93bb95267",
                  icon: <FaLinkedinIn className="text-blue-700" />,
                },
                {
                  href: "https://www.shubhanshutiwari.com",
                  icon: <FaGlobe className="text-green-500" />,
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                >
                  {item.icon}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;