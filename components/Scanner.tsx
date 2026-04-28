
import React, { useState, useRef, useEffect } from 'react';
import { PetProfile, MealAnalysis } from '../types';
import { ICONS } from '../constants';
import { gemini } from '../geminiService';

interface ScannerProps {
  onClose: () => void;
  onComplete: (analysis: MealAnalysis) => void;
  pet: PetProfile;
}

const TICKER_MESSAGES = [
  "Phase 01: Initializing Object Synthesis...",
  "Detecting ingredient clusters...",
  "Phase 02: Calibrating volumetric scale...",
  "Anchoring to bowl diameter...",
  "Phase 03: Mapping metabolic markers...",
  "Running toxicity cross-check...",
  "Finalizing clinical report..."
];

const Scanner: React.FC<ScannerProps> = ({ onClose, onComplete, pet }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setTickerIndex(prev => (prev + 1) % TICKER_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    setUploadProgress(10);
    const reader = new FileReader();
    
    // Simulate reading progress
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
      }
    };

    reader.onloadend = () => {
      setUploadProgress(100);
      setTimeout(() => {
        setImage(reader.result as string);
        setUploadProgress(0);
      }, 300);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const b64 = image.split(',')[1];
      const result = await gemini.analyzeMeal(b64, pet);
      onComplete(result);
    } catch (err: any) {
      console.error(err);
      setIsAnalyzing(false);
      setError("Your AI Nutritionist encountered some issues, please try again.");
    }
  };

  const handleRetry = () => {
    setError(null);
    setImage(null);
    setIsAnalyzing(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex flex-col bg-black animate-in fade-in duration-300"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="p-6 flex justify-between items-center z-10">
        <button onClick={onClose} className="text-white/80 p-2 hover:bg-white/10 rounded-full transition-all">
          <ICONS.X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-white font-black text-sm tracking-widest uppercase">Scanner</span>
          <div className="flex gap-1 mt-1">
            <div className={`h-1 w-4 rounded-full ${!image ? 'bg-[#FACC15]' : 'bg-white/20'}`} />
            <div className={`h-1 w-4 rounded-full ${image && !isAnalyzing ? 'bg-[#FACC15]' : 'bg-white/20'}`} />
            <div className={`h-1 w-4 rounded-full ${isAnalyzing ? 'bg-[#FACC15]' : 'bg-white/20'}`} />
          </div>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-sm aspect-[3/4] border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 group ${isDragging ? 'bg-[#FACC15]/10 border-[#FACC15] scale-105' : 'border-white/20 hover:bg-white/5'}`}
          >
            {uploadProgress > 0 ? (
              <div className="w-full px-12 text-center">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-[#FACC15] transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[#FACC15] font-black text-xs uppercase tracking-widest">Reading Image...</p>
              </div>
            ) : (
              <>
                <div className="p-6 rounded-full bg-white/10 group-hover:scale-110 group-hover:bg-[#FACC15]/20 transition-all">
                  {isDragging ? (
                    <ICONS.Upload className="w-12 h-12 text-[#FACC15] animate-bounce" />
                  ) : (
                    <ICONS.Scan className="w-12 h-12 text-[#FACC15]" />
                  )}
                </div>
                <p className="text-white/60 font-bold text-center px-8">
                  {isDragging ? "Drop to Scan" : "Tap to Scan or Import Photo"}
                  <br/>
                  <span className="text-[10px] uppercase font-black tracking-widest mt-2 block opacity-40">Always use the same bowl for more accurate results.</span>
                </p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        ) : (
          <div className="w-full max-w-sm relative group animate-in zoom-in-95 duration-500">
            <div className="relative aspect-[3/4] w-full">
              <img src={image} className="w-full h-full object-cover rounded-[32px] shadow-2xl" alt="Pet meal" />
              {!isAnalyzing && (
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-all border border-white/10"
                >
                  <ICONS.X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-[32px]">
                <div className="w-16 h-16 border-4 border-[#FACC15] border-t-transparent rounded-full animate-spin mb-8" />
                <p className="text-[#FACC15] font-black text-sm mb-2 animate-pulse uppercase tracking-[0.2em]">Analyzing</p>
                <div className="h-6 overflow-hidden">
                  <p className="text-white/80 text-xs font-bold animate-in slide-in-from-bottom-2">
                    {TICKER_MESSAGES[tickerIndex]}
                  </p>
                </div>
              </div>
            )}
            
            {error && !isAnalyzing && (
              <div className="absolute inset-0 bg-red-500/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-[32px] animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <ICONS.X className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-black text-lg mb-3 uppercase tracking-wide">Unable to Analyze</p>
                <p className="text-white/90 text-sm font-bold mb-8 max-w-xs leading-relaxed">
                  {error}
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={handleRetry}
                    className="w-full bg-white text-red-600 py-4 rounded-2xl font-black shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Retake Photo
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white/20 backdrop-blur-md text-white py-4 rounded-2xl font-black border border-white/40 hover:bg-white/30 transition-all"
                  >
                    Upload Different Image
                  </button>
                </div>
              </div>
            )}
            
            {!isAnalyzing && !error && (
              <div className="absolute inset-x-0 bottom-6 px-6 flex flex-col gap-3">
                <button 
                  onClick={handleAnalyze}
                  className="w-full bg-[#FACC15] text-black py-4 rounded-2xl font-black shadow-xl shadow-yellow-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <ICONS.Microscope className="w-5 h-5" /> Analyze Nutrition
                </button>
                <button 
                  onClick={() => setImage(null)}
                  className="w-full bg-black/10 backdrop-blur-md text-white py-4 rounded-2xl font-black border border-white/20 hover:bg-white/20 transition-all"
                >
                  Retake Photo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-8 text-center">
        <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.3em]">
          Safe-Scan Tech &bull; Clinical Vision Accuracy
        </p>
      </div>
    </div>
  );
};

export default Scanner;
