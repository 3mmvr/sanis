
import React, { useState, useMemo } from 'react';
import { UserSession, PetProfile, MealAnalysis, PetType } from '../types';
import { ICONS } from '../constants';
import Scanner from './Scanner';
import AnalysisView from './AnalysisView';
import { calculateStreak } from '../utils/streakCalculator';

interface DashboardProps {
  session: UserSession;
  currentPet: PetProfile;
  onPetSelect: (id: string) => void;
  onAddPet: () => void;
  onUpdateHistory: (petId: string, analysis: MealAnalysis) => void;
  onDeleteLog: (petId: string, logId: string) => void;
  onUpdateLog: (petId: string, updatedLog: MealAnalysis) => void;
  onUpdateSession: (session: UserSession) => void;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ session, currentPet, onPetSelect, onAddPet, onUpdateHistory, onDeleteLog, onUpdateLog, onUpdateSession, onNavigate }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<MealAnalysis | null>(null);
  
  // Get today's water log
  const today = new Date().toISOString().split('T')[0];
  const todayWaterLog = (session.waterLogs[currentPet.id] || []).find(log => log.date === today);
  const [waterCount, setWaterCount] = useState(todayWaterLog?.cups || 0);

  // Update water count in database
  const handleWaterChange = (newCount: number) => {
    setWaterCount(newCount);
    
    const updatedWaterLogs = { ...session.waterLogs };
    if (!updatedWaterLogs[currentPet.id]) {
      updatedWaterLogs[currentPet.id] = [];
    }
    
    const existingLogIndex = updatedWaterLogs[currentPet.id].findIndex(log => log.date === today);
    
    if (existingLogIndex >= 0) {
      updatedWaterLogs[currentPet.id][existingLogIndex] = { date: today, cups: newCount };
    } else {
      updatedWaterLogs[currentPet.id].push({ date: today, cups: newCount });
    }
    
    onUpdateSession({ ...session, waterLogs: updatedWaterLogs });
  };

  const history = session.history[currentPet.id] || [];
  const todayHistory = history.filter(m => new Date(m.timestamp).toDateString() === new Date().toDateString());
  
  // Use custom daily calorie target if set, otherwise calculate: roughly 60-70 kcal per kg for average pets
  const dailyTarget = currentPet.dailyCalorieTarget || (currentPet.weight * 65); 
  const caloriesConsumed = todayHistory.reduce((sum, m) => sum + m.calories, 0);
  const progressPercent = Math.min((caloriesConsumed / dailyTarget) * 100, 100);

  // Calculate real streak data
  const streakData = useMemo(() => calculateStreak(history), [history]);

  const handleAnalysisComplete = (analysis: MealAnalysis) => {
    onUpdateHistory(currentPet.id, analysis);
    setActiveAnalysis(analysis);
    setShowScanner(false);
  };

  const days = [
    { d: 'S', n: 27 }, { d: 'M', n: 28 }, { d: 'T', n: 29 }, 
    { d: 'W', n: 30 }, { d: 'T', n: 1 }, { d: 'F', n: 2, active: true }, { d: 'S', n: 3 }
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8F8F8] pb-36 relative overflow-x-hidden">
      {/* Refined Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-[#F8F8F8]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black text-black tracking-tightest">sanis</h1>
          <div className="flex -space-x-1.5 items-center">
            {session.pets.map(pet => (
              <button 
                key={pet.id} 
                onClick={() => onPetSelect(pet.id)}
                className={`w-9 h-9 rounded-full border-[2.5px] transition-all duration-300 flex items-center justify-center text-lg shadow-sm ${
                  currentPet.id === pet.id 
                    ? 'z-10 scale-110 border-black bg-white ring-4 ring-black/5' 
                    : 'border-white bg-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                {pet.type === PetType.DOG ? '🐶' : '🐱'}
              </button>
            ))}
            <button 
              onClick={onAddPet} 
              className="w-9 h-9 rounded-full border-2 border-dashed border-slate-300 bg-transparent flex items-center justify-center text-slate-400 font-bold hover:border-slate-500 hover:text-slate-500 transition-colors ml-1"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
          <ICONS.Flame className="w-3.5 h-3.5 text-yellow-500" />
          <span className="font-black text-xs">{streakData.currentStreak}</span>
        </div>
      </header>

      {/* Date Strip - Reduced Size */}
      <div className="px-4 py-2 mb-2">
        <div className="flex justify-between items-center px-2">
          {days.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full text-[10px] font-black transition-all ${
                day.active 
                  ? 'bg-black text-white shadow-lg shadow-black/10' 
                  : 'text-slate-300 bg-white/50 border border-black/5'
              }`}>
                {day.d}
              </div>
              <span className={`text-[10px] font-black ${day.active ? 'text-black' : 'text-slate-400'}`}>{day.n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Stats Grid - Reduced padding/margins */}
      <div className="px-6 grid grid-cols-2 gap-3.5 mt-2">
        {/* Progress Card */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-black/5">
          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-black">{Math.round(caloriesConsumed)}</span>
              <span className="text-slate-400 text-xs font-bold">/{Math.round(dailyTarget)}</span>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Kcal Today</p>
          </div>
          <div className="relative w-full aspect-square max-w-[120px] mx-auto">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="42%" className="stroke-[#F1F1F1]" strokeWidth="10" fill="transparent" />
                <circle cx="50%" cy="50%" r="42%" className="stroke-yellow-400 transition-all duration-1000 ease-out" strokeWidth="10" fill="transparent" 
                  strokeDasharray="264"
                  strokeDashoffset={264 * (1 - progressPercent / 100)}
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="flex gap-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                   <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                 </div>
              </div>
          </div>
        </div>

        {/* Pet Condition Card */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-black/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-black capitalize truncate">{currentPet.name}</span>
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight truncate block">
              {currentPet.breed} &bull; {currentPet.weight}kg
            </span>
          </div>
          
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-black border border-black/5">
                 <ICONS.Chart className="w-3.5 h-3.5" />
               </div>
               <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">Health</p>
                 <p className="text-xs font-black text-green-500">Peak</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-black border border-black/5">
                 <ICONS.Droplet className="w-3.5 h-3.5" />
               </div>
               <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">Hydration</p>
                 <p className="text-xs font-black text-black">
                   {currentPet.dailyWaterTarget ? Math.round((waterCount / currentPet.dailyWaterTarget) * 100) : Math.round((waterCount / 8) * 100)}%
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Tracker Widget */}
      <div className="px-6 mt-4">
        <div className="bg-white rounded-[28px] p-4 shadow-sm border border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F7FF] flex items-center justify-center border border-blue-50">
              <ICONS.Droplet className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="font-black text-black text-sm">Hydration</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                {waterCount} / {currentPet.dailyWaterTarget || 8} Cups
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={() => handleWaterChange(Math.max(0, waterCount - 0.5))} 
               className="w-9 h-9 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
             >
               <ICONS.Minus className="w-4 h-4" />
             </button>
             <button 
               onClick={() => handleWaterChange(waterCount + 0.5)} 
               className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 active:scale-95 transition-all"
             >
               <ICONS.Plus className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Recently Logged List */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-black text-black tracking-tight">Recent Logs</h3>
          <button 
            onClick={() => onNavigate('logs')}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-black transition-colors"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="bg-white rounded-[32px] py-12 px-8 text-center border border-dashed border-slate-200">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-black/5">
                 <ICONS.Bowl className="w-6 h-6 text-slate-300" />
               </div>
               <p className="text-slate-400 font-bold text-sm">No metabolic history found.</p>
               <button onClick={() => setShowScanner(true)} className="mt-2 text-yellow-500 text-xs font-black uppercase tracking-widest hover:text-yellow-600">Start Scanning</button>
            </div>
          ) : (
            history.slice(0, 3).map(meal => (
              <div 
                key={meal.id} 
                className="bg-white rounded-[24px] p-3 shadow-sm border border-black/5 flex gap-4 relative group"
              >
                <div 
                  onClick={() => setActiveAnalysis(meal)}
                  className="flex gap-4 flex-1 cursor-pointer hover:bg-slate-50/50 transition-all active:scale-[0.98] rounded-[20px] -m-3 p-3"
                >
                  <div className="w-20 h-20 rounded-[18px] overflow-hidden flex-shrink-0 bg-slate-100 border border-black/5">
                    <img src={meal.imageUrl} className="w-full h-full object-cover" alt={meal.mealName} onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=200'; }} />
                  </div>
                  <div className="flex-1 py-0.5">
                     <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-black text-black text-xs truncate max-w-[120px]">{meal.mealName}</h4>
                        <span className="text-[8px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-black/5">{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                     <div className="flex items-center gap-1 mb-2">
                        <ICONS.Flame className="w-3 h-3 text-yellow-500" />
                        <span className="font-black text-black text-base">{meal.calories} <span className="text-slate-400 text-[10px] font-bold">Kcal</span></span>
                     </div>
                     <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="text-[9px] font-black text-slate-500">{meal.protein}g</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-[9px] font-black text-slate-500">{meal.fat}g</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          <span className="text-[9px] font-black text-slate-500">{meal.carbs}g</span>
                        </div>
                     </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete "${meal.mealName}"?`)) {
                      onDeleteLog(currentPet.id, meal.id);
                    }
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 active:scale-90"
                >
                  <ICONS.Trash className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-black/5 pt-4 pb-8 z-40">
        <div className="max-w-md mx-auto px-6 flex items-center relative">
          <div className="flex justify-between items-center w-full pr-20">
            <button className="flex flex-col items-center gap-1 text-black">
              <ICONS.Home className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
            </button>
            <button 
              onClick={() => onNavigate('progress')}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-black transition-colors"
            >
              <ICONS.Chart className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Progress</span>
            </button>
            <button 
              onClick={() => onNavigate('settings')}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-black transition-colors"
            >
              <ICONS.Settings className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Settings</span>
            </button>
          </div>
          
          {/* Right-side FAB Scanner Button */}
          <button 
            onClick={() => setShowScanner(true)}
            className="absolute right-6 -top-8 bg-black text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-4 border-white"
          >
            <ICONS.Scan className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Modals */}
      {showScanner && (
        <Scanner 
          onClose={() => setShowScanner(false)} 
          onComplete={handleAnalysisComplete}
          pet={currentPet}
        />
      )}
      {activeAnalysis && (
        <AnalysisView 
          analysis={activeAnalysis} 
          onClose={() => setActiveAnalysis(null)} 
          pet={currentPet}
          onDelete={(logId) => onDeleteLog(currentPet.id, logId)}
          onUpdate={(updatedLog) => onUpdateLog(currentPet.id, updatedLog)}
        />
      )}
    </div>
  );
};

export default Dashboard;
