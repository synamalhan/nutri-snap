import React from 'react';

const Footer: React.FC = () => (
  <footer className="border-t border-gray-100 bg-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between gap-2 text-sm text-gray-500">
      <p>© {new Date().getFullYear()} NutriSnap</p>
      <p>Nutrition values are estimates per 100g and not medical advice.</p>
    </div>
  </footer>
);

export default Footer;
