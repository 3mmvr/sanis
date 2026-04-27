
import React, { useState } from 'react';
import { PetType, BowlSize, PetProfile, HEALTH_GOALS } from '../types';
import { ICONS } from '../constants';
import { calculateWaterRecommendation, getWaterRecommendationExplanation } from '../utils/waterCalculator';
import { DOG_BREEDS, CAT_BREEDS } from '../constants/breeds';

interface OnboardingProps {
  onComplete: (pet: PetProfile) => void;
  onBack: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [pet, setPet] = useState<Partial<PetProfile>>({
    type: PetType.DOG,
    healthGoals: [],
    bowlSize: BowlSize.MEDIUM,
    breed: ''
  });
  const [isOtherBreed, setIsOtherBreed] = useState(false);
  const [customWaterTarget, setCustomWaterTarget] = useState<number | null>(null);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => step === 1 ? onBack() : setStep(s => s - 1);

  const toggleGoal = (goal: string) => {
    setPet(prev => ({
      ...prev,
      healthGoals: prev.healthGoals?.includes(goal)
        ? prev.healthGoals.filter(g => g !== goal)
        : [...(prev.healthGoals || []), goal]
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-lg mt-12">
        <div className="flex justify-between items-center mb-10 px-4">
          <button onClick={handlePrev} className="p-3 text-black bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${i <= step ? 'bg-[#FACC15]' : 'bg-slate-200'}`} />
            ))}
          </div>
          <div className="w-10" />
        </div>

        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-black/5">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-black mb-2 text-center tracking-tight">Meet your pet.</h2>
              <p className="text-slate-400 text-center font-bold mb-8 text-sm">Select companion type</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: PetType.DOG, label: 'Dog', img: '🐕' },
                  { type: PetType.CAT, label: 'Cat', img: '🐈' }
                ].map(item => (
                  <button
                    key={item.type}
                    onClick={() => { setPet({ ...pet, type: item.type }); handleNext(); }}
                    className={`p-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 ${pet.type === item.type ? 'border-[#FACC15] bg-[#FFFBEB]' : 'border-slate-50 hover:border-[#FACC15]/30'}`}
                  >
                    <span className="text-5xl">{item.img}</span>
                    <span className="font-black text-black text-base">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black text-black mb-2 tracking-tight">Vitals.</h2>
              <p className="text-slate-400 font-bold mb-6 italic text-sm">Metabolic precision engine</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pet Name</label>
                  <input 
                    type="text"
                    value={pet.name || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Allow letters from any language (Unicode), spaces, and hyphens
                      // But reject numbers and special characters
                      if (val === '' || /^[\p{L}\s-]+$/u.test(val)) {
                        setPet({ ...pet, name: val });
                      }
                    }}
                    className="w-full bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 py-4 text-black font-bold focus:ring-2 ring-[#FACC15] outline-none transition-all"
                    placeholder={pet.type === PetType.DOG ? "e.g. Buddy" : "e.g. Luna"}
                  />
                  {pet.name && !/^[\p{L}\s-]+$/u.test(pet.name) && (
                    <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-wider">Please use only characters (English, Chinese, Japanese, etc.)</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Breed</label>
                  {!isOtherBreed ? (
                    <select 
                      value={pet.breed || ''}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setIsOtherBreed(true);
                          setPet({ ...pet, breed: '' });
                        } else {
                          setPet({ ...pet, breed: e.target.value });
                        }
                      }}
                      className="w-full bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 py-4 text-black font-bold focus:ring-2 ring-[#FACC15] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Breed</option>
                      {(pet.type === PetType.DOG ? DOG_BREEDS : CAT_BREEDS).map(breed => (
                        <option key={breed} value={breed}>{breed}</option>
                      ))}
                      <option value="Other">Others (Manual Input)</option>
                    </select>
                  ) : (
                    <div className="relative">
                      <input 
                        type="text"
                        value={pet.breed || ''}
                        onChange={(e) => setPet({ ...pet, breed: e.target.value })}
                        className="w-full bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 py-4 text-black font-bold focus:ring-2 ring-[#FACC15] outline-none transition-all"
                        placeholder="Type breed name..."
                        autoFocus
                      />
                      <button 
                        onClick={() => { setIsOtherBreed(false); setPet({ ...pet, breed: '' }); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase hover:text-black"
                      >
                        Back to List
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Weight (kg)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="200"
                    value={pet.weight || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setPet({ ...pet, weight: undefined });
                      } else {
                        const num = parseFloat(value);
                        // Round to 2 decimal places
                        const rounded = Math.round(num * 100) / 100;
                        setPet({ ...pet, weight: rounded });
                      }
                    }}
                    className="w-full bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 py-4 text-black font-bold focus:ring-2 ring-[#FACC15] outline-none transition-all"
                    placeholder={pet.type === PetType.DOG ? "25.50" : "4.67"}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Age (years)</label>
                  <input 
                    type="number"
                    min="0"
                    max="50"
                    value={pet.age || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setPet({ ...pet, age: undefined });
                      } else {
                        const num = parseInt(value);
                        if (num >= 0 && num <= 50) {
                          setPet({ ...pet, age: num });
                        }
                      }
                    }}
                    className="w-full bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 py-4 text-black font-bold focus:ring-2 ring-[#FACC15] outline-none transition-all"
                    placeholder="e.g. 3"
                  />
                  {pet.age !== undefined && (pet.age < 0 || pet.age > 50) && (
                    <p className="text-red-500 text-xs mt-2 font-bold">Age must be between 0 and 50 years</p>
                  )}
                </div>
              </div>
              <button 
                disabled={!pet.name || !pet.breed || !pet.weight}
                onClick={handleNext}
                className="w-full mt-8 bg-black text-white py-4 rounded-3xl font-black disabled:opacity-30 transition-all shadow-xl text-base"
              >
                Continue
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black text-black mb-2 tracking-tight">Goals.</h2>
              <p className="text-slate-400 font-bold mb-6 text-sm">AI customization priority</p>
              <div className="grid grid-cols-1 gap-3">
                {HEALTH_GOALS[pet.type || PetType.DOG].map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`text-left px-6 py-5 rounded-[24px] border transition-all font-black text-sm ${pet.healthGoals?.includes(goal) ? 'bg-[#FFFBEB] text-black border-[#FACC15] border-[3px]' : 'bg-[#F9F9F9] text-slate-600 border-black/5 hover:border-[#FACC15]'}`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleNext}
                className="w-full mt-8 bg-black text-white py-4 rounded-3xl font-black transition-all shadow-xl text-base"
              >
                Water Hydration
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black text-black mb-2 tracking-tight">Daily Hydration.</h2>
              <p className="text-slate-400 font-bold mb-6 text-sm">Water intake recommendation</p>
              
              {pet.weight && (
                <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <ICONS.Droplet className="w-12 h-12 text-blue-500" />
                    <div>
                      <p className="text-4xl font-black text-black">
                        {customWaterTarget !== null ? customWaterTarget : calculateWaterRecommendation(pet as PetProfile)}
                      </p>
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Cups per day</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed text-center">
                    {getWaterRecommendationExplanation(pet as PetProfile)}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Adjust if needed
                </label>
                <input 
                  type="number"
                  step="0.5"
                  value={customWaterTarget !== null ? customWaterTarget : (pet.weight ? calculateWaterRecommendation(pet as PetProfile) : '')}
                  onChange={(e) => setCustomWaterTarget(Number(e.target.value))}
                  className="w-full bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 py-4 text-black font-bold focus:ring-2 ring-blue-400 outline-none transition-all"
                  placeholder="Cups per day"
                />
                <p className="text-xs text-slate-400 font-bold">
                  💡 Tip: Adjust based on your pet's activity level, climate, and diet type (dry food needs more water).
                </p>
              </div>

              <button 
                onClick={handleNext}
                className="w-full mt-8 bg-black text-white py-4 rounded-3xl font-black transition-all shadow-xl text-base"
              >
                Bowl Size Setup
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
              <h2 className="text-2xl font-black text-black mb-2 tracking-tight">Bowl Size Anchor.</h2>
              <p className="text-slate-400 font-bold mb-2 text-sm">Volume calibration base for AI precision</p>
              <p className="text-xs text-slate-500 font-bold mb-8 px-4">
                Select your pet's typical feeding bowl size. This helps our AI accurately estimate portion sizes.
              </p>
              <div className="flex justify-between items-end gap-4 mb-6 px-2">
                {[
                  { size: BowlSize.SMALL, icon: '🥣', scale: 'scale-75', volume: '~200ml', cups: '0.8 cups', desc: 'Cats, Toy Breeds' },
                  { size: BowlSize.MEDIUM, icon: '🥣', scale: 'scale-100', volume: '~350ml', cups: '1.5 cups', desc: 'Small-Med Dogs' },
                  { size: BowlSize.LARGE, icon: '🥣', scale: 'scale-125', volume: '~600ml', cups: '2.5 cups', desc: 'Large Breeds' }
                ].map(item => (
                  <button
                    key={item.size}
                    onClick={() => setPet({ ...pet, bowlSize: item.size as BowlSize })}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-20 h-20 rounded-full border-4 transition-all duration-300 flex items-center justify-center ${pet.bowlSize === item.size ? 'bg-[#FFFBEB] border-[#FACC15] shadow-lg' : 'bg-slate-100 border-transparent group-hover:border-slate-200'}`}>
                      <span className={`text-4xl transition-transform duration-300 ${item.scale}`}>{item.icon}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${pet.bowlSize === item.size ? 'text-black' : 'text-slate-400'}`}>
                        {item.size}
                      </span>
                      <span className={`text-[9px] font-bold transition-colors ${pet.bowlSize === item.size ? 'text-black' : 'text-slate-300'}`}>
                        {item.volume}
                      </span>
                      <span className={`text-[8px] font-bold transition-colors ${pet.bowlSize === item.size ? 'text-slate-600' : 'text-slate-300'}`}>
                        ({item.cups})
                      </span>
                      <span className={`text-[7px] font-bold uppercase tracking-wider mt-1 transition-colors ${pet.bowlSize === item.size ? 'text-yellow-700' : 'text-slate-300'}`}>
                        {item.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 mx-4">
                <p className="text-xs text-blue-900 font-bold leading-relaxed">
                  💡 <span className="font-black">Pro Tip:</span> Choose the bowl you typically use for main meals. This helps us estimate portion sizes accurately for calorie calculations.
                </p>
              </div>
              <button 
                onClick={handleNext}
                className="w-full bg-black text-white py-4 rounded-3xl font-black transition-all shadow-xl text-base"
              >
                Allergies & Restrictions
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black text-black mb-2 tracking-tight">Allergies.</h2>
              <p className="text-slate-400 font-bold mb-6 text-sm">Food restrictions & sensitivities</p>
              
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Allergies (Optional)</label>
                <textarea
                  value={pet.allergies || ''}
                  onChange={(e) => setPet({ ...pet, allergies: e.target.value })}
                  placeholder="e.g. Chicken, Grain, Beef"
                  className="w-full bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 py-4 text-black font-bold focus:ring-2 ring-yellow-400 outline-none transition-all resize-none"
                  rows={4}
                />
                <p className="text-xs text-slate-400 font-bold">
                  🚨 This info will be used by AI to flag unsafe ingredients.
                </p>
              </div>

              <button 
                onClick={() => {
                  const waterTarget = customWaterTarget !== null ? customWaterTarget : calculateWaterRecommendation(pet as PetProfile);
                  onComplete({ 
                    ...pet, 
                    id: Math.random().toString(36).substr(2, 9),
                    dailyWaterTarget: waterTarget
                  } as PetProfile);
                }}
                className="w-full mt-8 bg-[#FACC15] text-black py-4 rounded-3xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-yellow-200/50 text-base"
              >
                Launch Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
