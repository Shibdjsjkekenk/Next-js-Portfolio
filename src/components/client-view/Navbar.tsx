"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  /*  Lock scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
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

            <Link href="/" className="font-bold hover:text-red-600 text-[17px]">
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
            <a
              href="tel:+918779597022"
              className="px-5 py-2 rounded-full bg-[#6A38C2] text-white font-medium"
            >
              Enquiry Now
            </a>
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
            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
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
              className="flex flex-col items-end gap-10 w-full pr-15"
            >
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/" },
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
