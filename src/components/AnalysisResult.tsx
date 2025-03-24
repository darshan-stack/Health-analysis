
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DetectionStatus } from '../utils/detectionModel';

interface AnalysisResultProps {
  results: {
    eyeStatus: DetectionStatus;
    tongueStatus: DetectionStatus;
    faceStatus: DetectionStatus;
    confidence: number;
    overallStatus: DetectionStatus;
    recommendations: {
      english: string;
      hindi: string;
    };
  } | null;
  isVisible: boolean;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ results, isVisible }) => {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  
  if (!results || !isVisible) return null;
  
  const getStatusText = (status: DetectionStatus): string => {
    switch (status) {
      case 'normal':
        return language === 'english' ? 'Normal' : 'सामान्य';
      case 'warning':
        return language === 'english' ? 'Mild Symptoms' : 'हल्के लक्षण';
      case 'alert':
        return language === 'english' ? 'Potential Infection' : 'संभावित संक्रमण';
      case 'not_detected':
        return language === 'english' ? 'Not Detected' : 'पता नहीं चला';
      default:
        return language === 'english' ? 'Unknown' : 'अज्ञात';
    }
  };
  
  const getStatusDescription = (type: 'eyes' | 'tongue' | 'face', status: DetectionStatus): string => {
    if (status === 'not_detected') {
      return language === 'english' 
        ? `${type.charAt(0).toUpperCase() + type.slice(1)} not properly detected.`
        : `${type === 'eyes' ? 'आंखें' : type === 'tongue' ? 'जीभ' : 'चेहरा'} सही ढंग से पता नहीं चला।`;
    }
    
    if (type === 'eyes') {
      switch (status) {
        case 'normal':
          return language === 'english'
            ? 'No unusual signs detected in the eyes.'
            : 'आंखों में कोई असामान्य संकेत नहीं मिले।';
        case 'warning':
          return language === 'english'
            ? 'Eyes appear slightly deepened, which may indicate mild dehydration or fatigue.'
            : 'आंखें थोड़ी गहरी दिखाई दे रही हैं, जो हल्के निर्जलीकरण या थकान का संकेत हो सकता है।';
        case 'alert':
          return language === 'english'
            ? 'Eyes appear deeply set, which can be a sign of fever or infection.'
            : 'आंखें गहरी दिखाई दे रही हैं, जो बुखार या संक्रमण का संकेत हो सकता है।';
        default:
          return '';
      }
    } else if (type === 'tongue') {
      switch (status) {
        case 'normal':
          return language === 'english'
            ? 'Tongue color appears normal.'
            : 'जीभ का रंग सामान्य दिखाई देता है।';
        case 'warning':
          return language === 'english'
            ? 'Tongue color appears slightly faded, which might indicate mild dehydration.'
            : 'जीभ का रंग थोड़ा फीका दिखाई देता है, जो हल्के निर्जलीकरण का संकेत हो सकता है।';
        case 'alert':
          return language === 'english'
            ? 'Tongue color appears significantly faded, which may indicate infection or illness.'
            : 'जीभ का रंग काफी फीका दिखाई देता है, जो संक्रमण या बीमारी का संकेत हो सकता है।';
        default:
          return '';
      }
    } else { // face
      switch (status) {
        case 'normal':
          return language === 'english'
            ? 'Face is properly detected.'
            : 'चेहरा सही ढंग से पता चला है।';
        default:
          return '';
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'hindi' : 'english');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="glassmorphism rounded-2xl p-6 mt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'english' ? 'Analysis Results' : 'विश्लेषण परिणाम'}
          </h3>
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleLanguage}
              className="text-xs font-medium px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {language === 'english' ? 'हिंदी में देखें' : 'View in English'}
            </button>
            <div className="text-sm text-gray-500">
              {language === 'english' ? 'Confidence' : 'विश्वास'}: {Math.round(results.confidence * 100)}%
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              results.overallStatus === 'normal' ? 'bg-health-normal' :
              results.overallStatus === 'warning' ? 'bg-health-warning' :
              results.overallStatus === 'alert' ? 'bg-health-alert' :
              'bg-gray-400'
            }`}
            style={{ width: `${Math.round(results.confidence * 100)}%` }}
          ></div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-start">
          <div className={`status-indicator ${results.faceStatus} mt-1`}></div>
          <div>
            <div className="font-medium">
              {language === 'english' ? 'Face' : 'चेहरा'}: {getStatusText(results.faceStatus)}
            </div>
            <p className="text-sm text-gray-600">{getStatusDescription('face', results.faceStatus)}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className={`status-indicator ${results.eyeStatus} mt-1`}></div>
          <div>
            <div className="font-medium">
              {language === 'english' ? 'Eyes' : 'आंखें'}: {getStatusText(results.eyeStatus)}
            </div>
            <p className="text-sm text-gray-600">{getStatusDescription('eyes', results.eyeStatus)}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className={`status-indicator ${results.tongueStatus} mt-1`}></div>
          <div>
            <div className="font-medium">
              {language === 'english' ? 'Tongue' : 'जीभ'}: {getStatusText(results.tongueStatus)}
            </div>
            <p className="text-sm text-gray-600">{getStatusDescription('tongue', results.tongueStatus)}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center mb-2">
            <div className={`status-indicator ${results.overallStatus}`}></div>
            <div className="font-semibold">
              {language === 'english' ? 'Overall' : 'समग्र'}: {getStatusText(results.overallStatus)}
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            {results.recommendations[language]}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisResult;
