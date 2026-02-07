import React, { useState } from 'react';
import { MealAnalysis, PetProfile } from '../types';
import { ICONS } from '../constants';
import { gemini } from '../geminiService';

interface AnalysisViewProps {
  analysis: MealAnalysis;
  pet: PetProfile;
  onClose: () => void;
  onDelete?: (logId: string) => void;
  onUpdate?: (updatedAnalysis: MealAnalysis) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, pet, onClose, onDelete, onUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [portion, setPortion] = useState(1);
  const [ingredients, setIngredients] = useState(analysis.ingredients);
  const [editingIngredient, setEditingIngredient] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Update analysis when portion changes
  const handlePortionChange = (newPortion: number) => {
    setPortion(newPortion);
    if (onUpdate) {
      const updatedAnalysis = {
        ...analysis,
        calories: Math.round(analysis.calories * newPortion),
        protein: Math.round(analysis.protein * newPortion),
        fat: Math.round(analysis.fat * newPortion),
        carbs: Math.round(analysis.carbs * newPortion),
      };
      onUpdate(updatedAnalysis);
    }
  };

  const handleDeleteIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    if (onUpdate) {
      onUpdate({ ...analysis, ingredients: newIngredients });
    }
  };

  const handleEditIngredient = (index: number) => {
    setEditingIngredient(index);
    setEditValue(ingredients[index]);
  };

  const handleSaveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = editValue;
    setIngredients(newIngredients);
    setEditingIngredient(null);
    if (onUpdate) {
      onUpdate({ ...analysis, ingredients: newIngredients });
    }
  };

  const handleAddIngredient = () => {
    const newIngredient = prompt('Enter ingredient name:');
    if (newIngredient && newIngredient.trim()) {
      const newIngredients = [...ingredients, newIngredient.trim()];
      setIngredients(newIngredients);
      if (onUpdate) {
        onUpdate({ ...analysis, ingredients: newIngredients });
      }
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Delete "${analysis.mealName}"?`)) {
      onDelete(analysis.id);
      onClose();
    }
  };

  const speakReport = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    const text = `Nutritional report for ${pet.name}. Today's meal is ${analysis.mealName}, containing approximately ${analysis.calories} calories. ${analysis.advice}. Recommendation: ${analysis.fridgeAdvice[0] || 'Keep up the good work.'}`;
    const audioData = await gemini.generateSpeech(text);
    
    if (audioData) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(audioData.buffer);
      const frameCount = dataInt16.length;
      const buffer = audioContext.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
    } else {
      setIsPlaying(false);
    }
  };

  const adjCalories = Math.round(analysis.calories * portion);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in slide-in-from-bottom duration-500 font-sans">
      {/* Top Banner Image with Overlay Buttons */}
      <div className="relative h-[45vh] w-full bg-slate-900">
        <img 
          src={analysis.imageUrl} 
          className="w-full h-full object-cover opacity-90" 
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=1000' }}
          alt="Meal Preview"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
          <button onClick={onClose} className="p-3 bg-white/15 backdrop-blur-xl text-white rounded-full hover:bg-white/25 transition-all active:scale-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex gap-3">
             <button className="p-3 bg-white/15 backdrop-blur-xl text-white rounded-full active:scale-90 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
             <button onClick={speakReport} className={`p-3 bg-white/15 backdrop-blur-xl rounded-full transition-all active:scale-90 ${isPlaying ? 'text-yellow-400' : 'text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Card (Slide Over Bottom) */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 -mt-16 relative z-10 no-scrollbar">
        <div className="bg-white rounded-t-[48px] p-6 min-h-full shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
           <div className="flex justify-between items-center mb-5">
             <div className="flex items-center gap-2">
               <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
               <span className="text-sm font-black text-slate-400">Log &bull; {new Date(analysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
             </div>
             <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-black/5">
               <button onClick={() => handlePortionChange(Math.max(0.25, portion - 0.25))} className="text-slate-400 hover:text-black font-black transition-colors px-1 text-xl">
                 <ICONS.Minus className="w-4 h-4" />
               </button>
               <span className="font-black text-sm w-12 text-center text-black">{portion.toFixed(1)}x</span>
               <button onClick={() => handlePortionChange(portion + 0.25)} className="text-slate-400 hover:text-black font-black transition-colors px-1 text-xl">
                 <ICONS.Plus className="w-4 h-4" />
               </button>
             </div>
           </div>

           <h2 className="text-2xl font-black text-black mb-6 tracking-tighter leading-tight">{analysis.mealName}</h2>

           {/* Floating Calorie Indicator */}
           <div className="flex items-center gap-4 bg-[#F9F9F9] rounded-[32px] p-5 mb-8 border border-black/5 shadow-sm">
             <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
               <ICONS.Flame className="w-7 h-7 text-yellow-500" />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">Calories</p>
               <p className="text-3xl font-black text-black">{adjCalories}</p>
             </div>
           </div>

           {/* Macro Stats */}
           <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: 'Protein', value: Math.round(analysis.protein * portion), color: 'bg-red-400' },
                { label: 'Carbs', value: Math.round(analysis.carbs * portion), color: 'bg-amber-400' },
                { label: 'Fats', value: Math.round(analysis.fat * portion), color: 'bg-blue-400' }
              ].map(macro => (
                <div key={macro.label} className="bg-white border border-slate-100 p-4 rounded-[28px] flex flex-col gap-1.5 shadow-sm">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${macro.color}`} />
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{macro.label}</span>
                   </div>
                   <span className="text-xl font-black text-black">{macro.value}g</span>
                </div>
              ))}
           </div>

           {/* Ingredients Breakdown */}
           <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-black text-black">Ingredients</h3>
                 <button onClick={handleAddIngredient} className="text-xs font-black text-yellow-500 hover:underline transition-all">+ Add more</button>
              </div>
              <div className="space-y-2.5">
                 {ingredients.map((ing, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-[24px] border border-black/5 group">
                      <div className="flex items-center gap-2 flex-1">
                        {editingIngredient === i ? (
                          <input 
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSaveIngredient(i)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveIngredient(i)}
                            className="font-black text-black text-sm bg-white px-2 py-1 rounded-lg border border-black/10 focus:outline-none focus:border-yellow-500 flex-1"
                            autoFocus
                          />
                        ) : (
                          <>
                            <span className="font-black text-black text-sm">{ing}</span>
                            <span className="text-[10px] text-slate-400 font-bold tracking-tight">&bull; {Math.round((analysis.calories/ingredients.length)*portion)} cal</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditIngredient(i)}
                          className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteIngredient(i)}
                          className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* AI Assistant Insight */}
           <div className="bg-black rounded-[40px] p-6 text-white mb-8 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400 rounded-full blur-[80px] opacity-10 -mr-16 -mt-16" />
             <div className="relative">
                <h3 className="font-black text-[9px] uppercase tracking-[0.3em] mb-4 flex items-center gap-2 text-yellow-400">
                  <ICONS.Dog className="w-4 h-4" /> sanis Nutrition AI
                </h3>
                <p className="text-slate-300 font-bold italic leading-relaxed mb-6 text-base">"{analysis.advice}"</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.fridgeAdvice.map((item, i) => (
                    <span key={i} className="px-4 py-2 bg-yellow-400 text-black rounded-2xl text-[10px] font-black shadow-lg shadow-yellow-400/20">+ {item}</span>
                  ))}
                </div>
             </div>
           </div>

           {/* Footer Actions */}
           <div className="flex gap-3 mb-6">
              {onDelete && (
                <button onClick={handleDelete} className="flex-1 py-4 rounded-[24px] bg-red-50 text-red-500 border border-red-100 font-black text-base transition-all active:scale-95 flex items-center justify-center gap-2 hover:bg-red-100">
                  <ICONS.Trash className="w-5 h-5" />
                  Delete Log
                </button>
              )}
              <button onClick={onClose} className="flex-1 py-4 rounded-[24px] bg-black text-white font-black text-base transition-all active:scale-95 hover:opacity-90 shadow-xl shadow-black/20">
                Done
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;