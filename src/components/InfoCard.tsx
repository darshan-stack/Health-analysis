
import React from 'react';
import { motion } from 'framer-motion';

interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  delay?: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  description, 
  icon, 
  accentColor, 
  delay = 0 
}) => {
  return (
    <motion.div 
      className="glassmorphism rounded-xl p-5 card-hover-effect"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-start">
        <div 
          className="flex-shrink-0 mr-4 p-3 rounded-lg"
          style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoCard;
