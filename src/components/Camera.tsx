
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { detectHealth, setupVoiceCommands, DetectionStatus } from '../utils/detectionModel';

interface CameraProps {
  onAnalysisComplete: (results: {
    eyeStatus: DetectionStatus;
    tongueStatus: DetectionStatus;
    faceStatus: DetectionStatus;
    confidence: number;
    overallStatus: DetectionStatus;
    recommendations: {
      english: string;
      hindi: string;
    };
  }) => void;
  analysisType: 'eyes' | 'tongue' | 'face' | 'idle';
}

const Camera: React.FC<CameraProps> = ({ onAnalysisComplete, analysisType }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isListening, setIsListening] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const voiceCommandsRef = useRef<{
    startListening: () => void;
    stopListening: () => void;
  } | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermission(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setPermission(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [facingMode]);

  // Setup voice commands
  useEffect(() => {
    if (permission) {
      const voiceCommands = setupVoiceCommands((command) => {
        // Handle received voice commands
        switch (command) {
          case 'analyze_eyes':
            if (analysisType === 'idle') onStartAnalysis('eyes');
            break;
          case 'analyze_tongue':
            if (analysisType === 'idle') onStartAnalysis('tongue');
            break;
          case 'analyze_face':
            if (analysisType === 'idle') onStartAnalysis('face');
            break;
          default:
            break;
        }
      });
      
      voiceCommandsRef.current = voiceCommands;
      
      return () => {
        if (voiceCommandsRef.current) {
          voiceCommandsRef.current.stopListening();
        }
      };
    }
  }, [permission, analysisType]);

  // Function to handle voice command toggle
  const toggleVoiceCommands = () => {
    if (!voiceCommandsRef.current) return;
    
    if (isListening) {
      voiceCommandsRef.current.stopListening();
    } else {
      voiceCommandsRef.current.startListening();
    }
    
    setIsListening(!isListening);
  };

  // Handle analysis type changes
  useEffect(() => {
    if (analysisType !== 'idle' && permission) {
      setIsScanning(true);
      const analyzeFrame = () => {
        if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          
          if (context) {
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw the video frame onto the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Get the image data for analysis
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            // Process the image data with our model
            const results = detectHealth(imageData, analysisType);
            
            // Pass results to parent component
            if (results) {
              onAnalysisComplete(results);
            }
          }
        }
        
        animationFrameRef.current = requestAnimationFrame(analyzeFrame);
      };
      
      animationFrameRef.current = requestAnimationFrame(analyzeFrame);
    } else {
      setIsScanning(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analysisType, permission, onAnalysisComplete]);

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  // Helper function to handle starting analysis from voice commands
  const onStartAnalysis = (type: 'eyes' | 'tongue' | 'face') => {
    // This will be called by voice commands, it passes the command up to the parent
    const event = new CustomEvent('startAnalysis', { detail: { type } });
    window.dispatchEvent(event);
  };

  if (permission === false) {
    return (
      <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="text-center p-6">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12H7" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 12H21" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3V7" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17V21" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Camera Access Required</h3>
          <p className="text-sm text-gray-500 mb-4">Please allow camera access to use the health detection features.</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="camera-container relative w-full h-64 md:h-96 overflow-hidden rounded-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-cover"
      />
      
      <canvas 
        ref={canvasRef} 
        className="hidden"
      />
      
      <div className="camera-overlay">
        {analysisType === 'face' && (
          <div className={`face-guide large ${isScanning ? 'active' : ''}`}>
            {isScanning && <div className="scanning-line"></div>}
            <div className="guide-text">Position your face here</div>
          </div>
        )}
        
        {analysisType === 'eyes' && (
          <div className={`face-guide ${isScanning ? 'active' : ''}`} style={{ top: '35%' }}>
            {isScanning && <div className="scanning-line"></div>}
            <div className="guide-text">Position your eyes here</div>
          </div>
        )}
        
        {analysisType === 'tongue' && (
          <div className={`face-guide ${isScanning ? 'active' : ''}`} style={{ top: '65%' }}>
            {isScanning && <div className="scanning-line"></div>}
            <div className="guide-text">Position your tongue here</div>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <motion.button
          className="p-3 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-gray-700 hover:bg-white transition-all"
          whileTap={{ scale: 0.95 }}
          onClick={toggleCamera}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 1L21 5L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 23L3 19L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
        
        <motion.button
          className={`p-3 rounded-full ${isListening ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-700'} backdrop-blur-md shadow-sm hover:bg-opacity-100 transition-all`}
          whileTap={{ scale: 0.95 }}
          onClick={toggleVoiceCommands}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1.5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 3L16 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 3L8 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 9.5C18 11.6 16.16 13.25 14 13.25H10C7.84 13.25 6 11.6 6 9.5V8.75C6 6.6 7.84 4.75 10 4.75H14C16.16 4.75 18 6.6 18 8.75V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17.25V21.25C8 21.66 8.34 22 8.75 22H15.25C15.66 22 16 21.66 16 21.25V17.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13.25V19.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
      
      {isListening && (
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-full animate-pulse">
            Voice Commands Active
          </div>
        </div>
      )}
      
      {isScanning && (
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-full animate-pulse-gentle">
            {analysisType === 'eyes' ? 'Scanning Eyes' : 
             analysisType === 'tongue' ? 'Scanning Tongue' : 'Detecting Face'}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Camera;
