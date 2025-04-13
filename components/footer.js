import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className=" text-gray-300 py-10 px-6 md:px-20 shadow-[0_0_30px_rgba(128,0,255,0.3)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Logo & Slogan */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">Dyslexi AI</h2>
          <p className="text-sm text-purple-300">Empowering minds through AI-powered dyslexia detection and therapy.</p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-lg">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-purple-400 transition duration-200">Home</Link></li>
            <li><Link href="/about" className="hover:text-purple-400 transition duration-200">Features</Link></li>
            <li><Link href="/dashboard" className="hover:text-purple-400 transition duration-200">Therapy Tools</Link></li>
            <li><Link href="/help" className="hover:text-purple-400 transition duration-200">Help Section</Link></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-lg">Connect with Us</h3>
          <p className="text-sm text-purple-300 mb-2">Email: dyslexiaai@gmail.com</p>
          <div className="flex gap-6 mt-2">
            <Link href="/" className="hover:text-purple-400 transition duration-200">
              <i className="fab fa-twitter" /> Twitter
            </Link>
            <Link href="/" className="hover:text-purple-400 transition duration-200">
              <i className="fab fa-linkedin" /> LinkedIn
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-purple-800 pt-4 text-center text-xs text-gray-500 tracking-wider">
        © 2025 <span className="text-purple-400 font-medium">Dyslexi AI</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
