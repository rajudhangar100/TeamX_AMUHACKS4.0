import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="h-[10vh] flex items-center justify-between px-4 mx-auto text-white font-semibold text-lg shadow-md shadow-purple-800/40 backdrop-blur-sm">
      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 drop-shadow-md">
        <Link href={'/'}>Dyslexi Ai</Link>
      </div>
      <div className="navigation flex gap-10">
        <Link href="/" className="hover:text-pink-400 hover:underline transition">Home</Link>
        <Link href="/about" className="hover:text-pink-400 hover:underline transition">About</Link>
        <Link href="/doctors" className="hover:text-pink-400 hover:underline transition">Get Help</Link>
      </div>
    </nav>
  );
};

export default Navbar;
