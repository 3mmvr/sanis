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
  const [totalWeight, setTotalWeight] = useState(() => {
    const sum = analysis.ingredients.reduce((acc, ing) => acc + ing.weight, 0);
    // If it's already confirmed, always show the real sum
    if (analysis.isConfirmed) return sum;
    // Otherwise apply heuristic for new scans
    const isPackaged = analysis.mealName.toLowerCase().match(/pack|bag|box|treat|snack|kibble/);
    return isPackaged ? 0 : sum;
  });
  const [ingredients, setIngredients] = useState(() => {
    // Sync ingredient weights with the initial totalWeight
    const isPackaged = !analysis.isConfirmed && analysis.mealName.toLowerCase().match(/pack|bag|box|treat|snack|kibble/);
    if (isPackaged) {
      return analysis.ingredients.map(ing => ({ ...ing, weight: 0 }));
    }
    return analysis.ingredients;
  });
  const [editingIngredient, setEditingIngredient] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editWeight, setEditWeight] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(analysis.isConfirmed || false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(analysis);

  // Scaling logic: Adjust all ingredients based on a new total weight
  const handleTotalWeightChange = (newTotal: number) => {
    if (newTotal < 0) return;
    
    const currentTotal = ingredients.reduce((acc, ing) => acc + ing.weight, 0);
    setTotalWeight(newTotal);

    let updatedIngredients;
    if (currentTotal === 0) {
      // If original is 0, distribute new total evenly among ingredients
      const evenWeight = newTotal / (ingredients.length || 1);
      updatedIngredients = ingredients.map(ing => ({ ...ing, weight: Math.round(evenWeight) }));
    } else {
      // Proportional scaling
      const factor = newTotal / currentTotal;
      updatedIngredients = ingredients.map(ing => ({
        ...ing,
        weight: Math.round(ing.weight * factor)
      }));
    }

    setIngredients(updatedIngredients);
    setIsConfirmed(false); // Invalidate advice if weights change
    if (onUpdate) {
      onUpdate({ ...currentAnalysis, ingredients: updatedIngredients, isConfirmed: false });
    }
  };

  const handleDeleteIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    // Sync total weight
    const newTotal = newIngredients.reduce((acc, ing) => acc + ing.weight, 0);
    setTotalWeight(newTotal);
    
    if (onUpdate) {
      onUpdate({ ...analysis, ingredients: newIngredients });
    }
  };

  const handleEditIngredient = (index: number) => {
    setEditingIngredient(index);
    setEditName(ingredients[index].name);
    setEditWeight(ingredients[index].weight);
  };

  const handleSaveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { name: editName, weight: Number(editWeight) };
    setIngredients(newIngredients);
    
    // Sync total weight
    const newTotal = newIngredients.reduce((acc, ing) => acc + ing.weight, 0);
    setTotalWeight(newTotal);
    
    setEditingIngredient(null);
    setIsConfirmed(false); // Require re-confirm if ingredients change
    if (onUpdate) {
      onUpdate({ ...analysis, ingredients: newIngredients, isConfirmed: false });
    }
  };

  const handleAddIngredient = () => {
    const name = prompt('Enter ingredient name:');
    if (name) {
      const weight = Number(prompt('Enter weight (g):') || 0);
      const newIngredients = [...ingredients, { name, weight }];
      setIngredients(newIngredients);
      
      // Sync total weight
      const newTotal = newIngredients.reduce((acc, ing) => acc + ing.weight, 0);
      setTotalWeight(newTotal);
      
      setIsConfirmed(false);
      if (onUpdate) {
        onUpdate({ ...analysis, ingredients: newIngredients, isConfirmed: false });
      }
    }
  };

  const handleConfirm = async () => {
    setIsReanalyzing(true);
    try {
      const result = await gemini.reAnalyzeMeal(ingredients, pet);
      setIsConfirmed(true);
      const updatedAnalysis = { 
        ...currentAnalysis, 
        ...result, 
        ingredients, 
        isConfirmed: true 
      };
      setCurrentAnalysis(updatedAnalysis);
      if (onUpdate) {
        onUpdate(updatedAnalysis);
      }
    } catch (error) {
      console.error("Re-analysis failed", error);
      alert("Your AI Nutritionist encountered some issues, please try again.");
    } finally {
      setIsReanalyzing(false);
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
    const text = `Nutritional report for ${pet.name}. Today's meal is ${currentAnalysis.mealName}, containing approximately ${Math.round(currentAnalysis.calories)} calories. ${currentAnalysis.advice}. Recommendation: ${currentAnalysis.fridgeAdvice[0] || 'Keep up the good work.'}`;
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
             <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-full border border-black/5">
               <button onClick={() => handleTotalWeightChange(Math.max(0, totalWeight - 10))} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-400 hover:text-black transition-all active:scale-90">
                 <ICONS.Minus className="w-3 h-3" />
               </button>
               <div className="flex flex-col items-center px-2">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Weight</span>
                 <div className="flex items-baseline gap-1">
                   <input 
                     type="number"
                     value={totalWeight}
                     onChange={(e) => handleTotalWeightChange(Number(e.target.value))}
                     className="font-black text-sm w-12 text-center text-black bg-transparent border-none focus:outline-none p-0"
                   />
                   <span className="text-[10px] font-black text-black">g</span>
                 </div>
               </div>
               <button onClick={() => handleTotalWeightChange(totalWeight + 10)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-400 hover:text-black transition-all active:scale-90">
                 <ICONS.Plus className="w-3 h-3" />
               </button>
             </div>
           </div>

           <h2 className="text-2xl font-black text-black mb-6 tracking-tighter leading-tight">{currentAnalysis.mealName}</h2>

           {/* Nutritional data shown only after confirmation */}
           {isConfirmed && (
             <div className="animate-in fade-in slide-in-from-top-4 duration-500">
               {/* Floating Calorie Indicator */}
               <div className="flex items-center gap-4 bg-[#F9F9F9] rounded-[32px] p-5 mb-6 border border-black/5 shadow-sm">
                 <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                   <ICONS.Flame className="w-7 h-7 text-yellow-500" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">Calories</p>
                   <p className="text-3xl font-black text-black">{Math.round(currentAnalysis.calories)}</p>
                 </div>
               </div>

               {/* Macro Stats */}
               <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { label: 'Protein', value: Math.round(currentAnalysis.protein), color: 'bg-red-400' },
                    { label: 'Carbs', value: Math.round(currentAnalysis.carbs), color: 'bg-amber-400' },
                    { label: 'Fats', value: Math.round(currentAnalysis.fat), color: 'bg-blue-400' }
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
             </div>
           )}

            {/* Ingredients Table */}
            <div className="mb-8">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-black">Ingredients</h3>
                  <button onClick={handleAddIngredient} className="text-xs font-black text-yellow-500 hover:underline transition-all">+ Add more</button>
               </div>
               
               <div className="overflow-hidden bg-slate-50 rounded-[32px] border border-black/5">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-black/5">
                       <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Food Name</th>
                       <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</th>
                       <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-black/5">
                     {ingredients.map((ing, i) => (
                       <tr key={i} className="group hover:bg-white transition-colors">
                         <td className="px-4 py-4">
                           {editingIngredient === i ? (
                             <input 
                               type="text"
                               value={editName}
                               onChange={(e) => setEditName(e.target.value)}
                               className="w-full font-black text-black text-sm bg-white px-2 py-1.5 rounded-lg border border-black/10 focus:outline-none focus:border-yellow-500"
                               autoFocus
                             />
                           ) : (
                                                           <span className="font-black text-black text-xs block whitespace-normal break-words">{ing.name}</span>
                           )}
                         </td>
                         <td className="px-4 py-4">
                           {editingIngredient === i ? (
                             <div className="flex items-center gap-1">
                               <input 
                                 type="number"
                                 value={editWeight}
                                 onChange={(e) => setEditWeight(Number(e.target.value))}
                                 className="w-14 font-black text-black text-xs bg-white px-2 py-1.5 rounded-lg border border-black/10 focus:outline-none focus:border-yellow-500"
                               />
                               <span className="text-[9px] font-black text-slate-400">g</span>
                             </div>
                           ) : (
                             <span className="text-xs font-bold text-slate-600">{ing.weight}g</span>
                           )}
                         </td>
                         <td className="px-4 py-4 text-right">
                           {editingIngredient === i ? (
                             <button 
                               onClick={() => handleSaveIngredient(i)}
                               className="bg-black text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                             >
                               Save
                             </button>
                           ) : (
                             <div className="flex items-center justify-end gap-2 transition-opacity">
                               <button onClick={() => handleEditIngredient(i)} className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:bg-blue-50 p-1 rounded">Edit</button>
                               <button onClick={() => handleDeleteIngredient(i)} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 p-1 rounded">Delete</button>
                             </div>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>

               {!isConfirmed && (
                 <button 
                   onClick={handleConfirm}
                   disabled={isReanalyzing}
                   className="w-full mt-4 py-5 bg-yellow-400 text-black rounded-[32px] font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                   {isReanalyzing ? (
                     <>
                       <div className="w-5 h-5 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                       Analyzing...
                     </>
                   ) : (
                     <>
                       <ICONS.Flame className="w-5 h-5" />
                       Confirm Ingredients
                     </>
                   )}
                 </button>
               )}
            </div>

            {/* AI Assistant Insight */}
            {isConfirmed && (
              <div className="bg-black rounded-[40px] p-6 text-white mb-8 relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400 rounded-full blur-[80px] opacity-10 -mr-16 -mt-16" />
                <div className="relative">
                   <h3 className="font-black text-[9px] uppercase tracking-[0.3em] mb-4 flex items-center gap-2 text-yellow-400">
                     <ICONS.Dog className="w-4 h-4" /> sanis Nutrition AI
                   </h3>
                   <p className="text-slate-300 font-bold italic leading-relaxed mb-6 text-base">"{currentAnalysis.advice}"</p>
                   <div className="flex flex-wrap gap-2">
                     {currentAnalysis.fridgeAdvice.map((item, i) => (
                       <span key={i} className="px-4 py-2 bg-yellow-400 text-black rounded-2xl text-[10px] font-black shadow-lg shadow-yellow-400/20">+ {item}</span>
                     ))}
                   </div>
                </div>
              </div>
            )}

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