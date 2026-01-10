"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-b from-white to-[#e6e6f3] fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <Image src={logo} alt="logo" className="w-36 h-12" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 gap-5">
            <Link href="/" className="font-bold text-[17px] hover:text-red-600">
              Home
            </Link>

            <div className="relative">
              <Link
                href="#services"
                className="font-bold text-[17px] hover:text-red-600"
              >
                Our Services
              </Link>
              <span className="absolute -top-3 -right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0 rounded-full">
                New
              </span>
            </div>

            <Link href="/contact" className="font-bold text-[16px] hover:text-red-600">
              Contact Us
            </Link>
          </div>

          {/* Button */}
          <a
            href="tel:+918779597022"
            className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#6A38C2] text-white font-medium"
          >
            Enquiry Now
          </a>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <Link href="/" className="block px-4 py-2 font-bold">
            Home
          </Link>
          <Link href="#services" className="block px-4 py-2 font-bold">
            Services
          </Link>
          <Link href="/" className="block px-4 py-2 font-bold">
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
