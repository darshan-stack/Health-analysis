
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="w-full py-8 mt-12 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6">
          <div className="mb-4 md:mb-0">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} HealthSight. All rights reserved.
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Not intended for diagnostic purposes. Seek professional medical advice.
            </div>
          </div>
          
          <div className="flex space-x-6">
            <a href="#privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Terms
            </a>
            <a href="#contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
