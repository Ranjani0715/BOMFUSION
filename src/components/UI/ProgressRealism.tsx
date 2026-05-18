import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../store/appStore';

interface ProgressRealismProps {
  onComplete: () => void;
  title: string;
  subtitle: string;
  messages: string[];
}

export function ProgressRealism({ onComplete, title, subtitle, messages }: ProgressRealismProps) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const runSequence = async () => {
      // Phase 1: 0-15 in 280ms
      setProgress(15);
      await new Promise(r => setTimeout(r, 280));
      
      // Phase 2: 15-42 in 1400ms
      setProgress(42);
      await new Promise(r => setTimeout(r, 1400));
      
      // Phase 3: pause at 42 for 600ms
      await new Promise(r => setTimeout(r, 600));
      
      // Phase 4: 42-71 in 900ms
      setProgress(71);
      await new Promise(r => setTimeout(r, 900));
      
      // Phase 5: pause at 71 for 800ms
      await new Promise(r => setTimeout(r, 800));
      
      // Phase 6: 71-94 in 500ms
      setProgress(94);
      await new Promise(r => setTimeout(r, 500));
      
      // Phase 7: pause at 94 for 400ms
      await new Promise(r => setTimeout(r, 400));
      
      // Phase 8: 94-100 in 200ms
      setProgress(100);
      await new Promise(r => setTimeout(r, 200));
      
      setIsFinalizing(true);
      await new Promise(r => setTimeout(r, 300));
      onComplete();
    };

    runSequence();

    // Message rotation at irregular intervals
    const updateMessage = () => {
      setMsgIndex(prev => (prev + 1) % messages.length);
      const nextDelay = Math.floor(Math.random() * 800) + 400;
      timeout = setTimeout(updateMessage, nextDelay);
    };
    timeout = setTimeout(updateMessage, 500);

    return () => clearTimeout(timeout);
  }, [onComplete, messages]);

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-slate-200 rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
        
        <div className="relative h-2 bg-slate-200 rounded overflow-hidden mb-4">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-blue-600"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 italic">
            {isFinalizing ? "Finalizing results..." : messages[msgIndex]}
          </p>
          <p className="text-xs font-mono text-slate-400">{Math.round(progress)}%</p>
        </div>
      </motion.div>
    </div>
  );
}
