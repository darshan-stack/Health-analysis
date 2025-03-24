
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import Header from '@/components/Header';
import Camera from '@/components/Camera';
import AnalysisResult from '@/components/AnalysisResult';
import InfoCard from '@/components/InfoCard';
import Footer from '@/components/Footer';
import { DetectionStatus } from '@/utils/detectionModel';

const Index = () => {
  const { toast } = useToast();
  const [analysisType, setAnalysisType] = useState<'eyes' | 'tongue' | 'face' | 'idle'>('idle');
  const [results, setResults] = useState<{
    eyeStatus: DetectionStatus;
    tongueStatus: DetectionStatus;
    faceStatus: DetectionStatus;
    confidence: number;
    overallStatus: DetectionStatus;
    recommendations: {
      english: string;
      hindi: string;
    };
  } | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Listen for voice command events
  useEffect(() => {
    const handleVoiceCommand = (e: CustomEvent) => {
      if (e.detail && e.detail.type) {
        startAnalysis(e.detail.type);
      }
    };

    window.addEventListener('startAnalysis', handleVoiceCommand as EventListener);
    
    return () => {
      window.removeEventListener('startAnalysis', handleVoiceCommand as EventListener);
    };
  }, []);

  const handleAnalysisComplete = (analysisResults: {
    eyeStatus: DetectionStatus;
    tongueStatus: DetectionStatus;
    faceStatus: DetectionStatus;
    confidence: number;
    overallStatus: DetectionStatus;
    recommendations: {
      english: string;
      hindi: string;
    };
  }) => {
    setResults(analysisResults);
    setShowResults(true);
    setAnalysisType('idle');
    
    sonnerToast('Analysis Complete', {
      description: 'Your health analysis has been completed successfully.',
      position: 'top-center',
    });
  };

  const startAnalysis = (type: 'eyes' | 'tongue' | 'face') => {
    setAnalysisType(type);
    setShowResults(false);
    
    toast({
      title: `Starting ${type} analysis`,
      description: type === 'face' 
        ? 'Please ensure your entire face is visible within the guide for accurate detection.' 
        : `Please position your ${type} within the guide circle for the best results.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-12">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Real-Time Health Analysis
          </motion.h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Controls */}
            <motion.div 
              className="lg:w-1/3 flex flex-col gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Detection Controls</h2>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => startAnalysis('face')}
                    className="flex items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm button-hover-effect"
                    disabled={analysisType !== 'idle'}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 10V12M15 10V12M7 17C9 18.3333 15 18.3333 17 17M7 8C7 5.79086 8.79086 4 11 4H13C15.2091 4 17 5.79086 17 8V13C17 15.2091 15.2091 17 13 17H11C8.79086 17 7 15.2091 7 13V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Detect Face
                  </button>
                  <button 
                    onClick={() => startAnalysis('eyes')}
                    className="flex items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm button-hover-effect"
                    disabled={analysisType !== 'idle'}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12C2 12 5.5 7 12 7C18.5 7 22 12 22 12C22 12 18.5 17 12 17C5.5 17 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Analyze Eyes
                  </button>
                  <button 
                    onClick={() => startAnalysis('tongue')}
                    className="flex items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm button-hover-effect"
                    disabled={analysisType !== 'idle'}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Analyze Tongue
                  </button>
                </div>
              </div>
              
              {/* Results Section */}
              <AnalysisResult 
                results={results} 
                isVisible={showResults} 
              />
              
              {/* Instructions Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-3">How It Works</h2>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs font-medium">
                      1
                    </div>
                    <span>Ensure your face is visible for initial detection</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs font-medium">
                      2
                    </div>
                    <span>Position your eyes or tongue within the guide when prompted</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs font-medium">
                      3
                    </div>
                    <span>Receive multilingual health recommendations</span>
                  </li>
                </ol>
                <div className="mt-3 text-xs text-gray-500 italic">
                  <p>This application is for informational purposes only. Always consult a healthcare professional for proper diagnosis.</p>
                </div>
              </div>
            </motion.div>
            
            {/* Right Side - Camera */}
            <motion.div 
              className="lg:w-2/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <Camera 
                  onAnalysisComplete={handleAnalysisComplete} 
                  analysisType={analysisType} 
                />
                
                <div className="mt-4 text-sm bg-blue-50 p-3 rounded-xl text-blue-700">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <p className="font-medium">Camera Instructions</p>
                      <p className="mt-1">Use the camera controls in the bottom-right to switch cameras or enable voice commands. For best results, ensure good lighting and position clearly in the frame.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <InfoCard 
                  title="Multilingual Support"
                  description="Toggle between English and Hindi for analysis results and health recommendations."
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                  accentColor="#ec4899"
                  delay={0.1}
                />
                
                <InfoCard 
                  title="Voice Command Control"
                  description="Enable voice commands to control the application hands-free for easier analysis."
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1.5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 9L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 9L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 9C19 11.7614 15.866 14 12 14C8.13401 14 5 11.7614 5 9M19 15C19 17.7614 15.866 20 12 20C8.13401 20 5 17.7614 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                  accentColor="#8b5cf6"
                  delay={0.2}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
