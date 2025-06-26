import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">NutriSnap</h3>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              AI-powered visual nutrition analyzer helping you make healthier food choices. 
              Simply snap a photo of your meal and get instant nutritional insights.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Food Detection</li>
              <li>Nutrition Analysis</li>
              <li>Health Ratings</li>
              <li>Meal History</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2024 NutriSnap. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2 sm:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 inline mx-1" /> for healthier eating
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;