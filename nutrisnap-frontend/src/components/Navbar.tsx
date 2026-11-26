import React from 'react';
import { Camera, Github } from 'lucide-react';

const Navbar: React.FC = () => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
      <a href="/" className="flex items-center gap-2.5">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl shadow-md shadow-emerald-500/20">
          <Camera className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">NutriSnap</span>
      </a>
      <a
        href="https://github.com/synamalhan/nutri-snap"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Github className="h-5 w-5" /> <span className="hidden sm:inline">GitHub</span>
      </a>
    </div>
  </nav>
);

export default Navbar;
