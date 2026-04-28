
import React, { useState, useMemo } from 'react';
import { UserSession, PetProfile, MealAnalysis } from '../types';
import { ICONS } from '../constants';
import AnalysisView from './AnalysisView';

interface LogsViewProps {
  session: UserSession;
  currentPet?: PetProfile;
  onBack: () => void;
  onNavigate: (view: string) => void;
  onDeleteLog: (petId: string, logId: string) => void;
  onUpdateLog: (petId: string, updatedLog: MealAnalysis) => void;
  onAddPet: () => void;
}

type FilterType = 'today' | 'week' | 'all';

const LogsView: React.FC<LogsViewProps> = ({ session, currentPet, onBack, onNavigate, onDeleteLog, onUpdateLog, onAddPet }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<MealAnalysis | null>(null);

  const history = currentPet ? (session.history[currentPet.id] || []) : [];

  const handleReuse = (meal: MealAnalysis) => {
    if (!currentPet) return;
    const reusedMeal: MealAnalysis = {
      ...meal,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      isConfirmed: false 
    };
    onUpdateLog(currentPet.id, reusedMeal); 
    setActiveAnalysis(reusedMeal);
  };

  const filteredLogs = useMemo(() => {
    let filtered = [...history];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();

    if (activeFilter === 'today') {
      filtered = filtered.filter(log => log.timestamp >= todayStart);
    } else if (activeFilter === 'week') {
      filtered = filtered.filter(log => log.timestamp >= weekStart);
    }

    if (selectedDate) {
      const selectedDateStart = new Date(selectedDate).getTime();
      const selectedDateEnd = selectedDateStart + 24 * 60 * 60 * 1000;
      filtered = filtered.filter(log => log.timestamp >= selectedDateStart && log.timestamp < selectedDateEnd);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.mealName.toLowerCase().includes(query) ||
        log.ingredients.some(ing => ing.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [history, activeFilter, searchQuery, selectedDate]);

  const groupedLogs = useMemo(() => {
    const groups: Record<string, MealAnalysis[]> = {};
    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(log);
    });
    return groups;
  }, [filteredLogs]);

  const totalCalories = filteredLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalMeals = filteredLogs.length;

  if (!currentPet) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F8F8F8] pb-24">
        <header className="px-6 pt-8 pb-5 flex items-center gap-4 bg-white border-b border-black/5">
          <button onClick={onBack} className="p-2 text-black bg-slate-50 rounded-full shadow-sm border border-black/5 active:scale-90 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-black text-black tracking-tight">All Logs</h1>
        </header>
        <main className="px-6 py-10">
          <div className="bg-orange-50 border border-orange-200 rounded-[24px] p-5 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="flex-1">
              <p className="text-orange-900 font-black text-sm mb-1 leading-tight">No Pet Profile Found</p>
              <p className="text-orange-700 text-[11px] font-bold leading-relaxed mb-3">
                Please add at least one pet to view historical logs and nutritional data.
              </p>
              <button 
                onClick={onAddPet}
                className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-orange-600 transition-colors shadow-sm"
              >
                + Add Your First Pet
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8F8F8] pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-5 flex items-center justify-between bg-white border-b border-black/5 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-black bg-slate-50 rounded-full shadow-sm border border-black/5 active:scale-90 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-black tracking-tight">All Logs</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentPet.name}'s History</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-black">{totalMeals}</span>
          <span className="text-[8px] font-black text-slate-400 uppercase">Meals</span>
        </div>
      </header>
      <main className="px-6 py-5 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meals or ingredients..."
            className="w-full bg-white border border-black/5 rounded-[20px] pl-12 pr-4 py-3.5 text-sm font-bold placeholder:text-slate-300 focus:ring-2 ring-yellow-400 outline-none transition-all shadow-sm"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ICONS.X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => { setActiveFilter('today'); setSelectedDate(''); }}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeFilter === 'today' && !selectedDate
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-slate-500 border border-black/5 hover:border-black/20'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => { setActiveFilter('week'); setSelectedDate(''); }}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeFilter === 'week' && !selectedDate
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-slate-500 border border-black/5 hover:border-black/20'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => { setActiveFilter('all'); setSelectedDate(''); }}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeFilter === 'all' && !selectedDate
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-slate-500 border border-black/5 hover:border-black/20'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedDate
                ? 'bg-yellow-400 text-black shadow-lg'
                : 'bg-white text-slate-500 border border-black/5 hover:border-black/20'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Date'}
          </button>
        </div>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <div className="bg-white rounded-[24px] p-4 shadow-lg border border-black/5 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Date</span>
              <button onClick={() => { setSelectedDate(''); setShowDatePicker(false); }} className="text-xs font-black text-red-500">Clear</button>
            </div>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setShowDatePicker(false); }}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-slate-50 border border-black/5 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:ring-2 ring-yellow-400"
            />
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-black/5 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-black">{totalMeals}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Meals</p>
          </div>
          <div className="text-center border-x border-black/5">
            <p className="text-2xl font-black text-black">{Math.round(totalCalories)}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Kcal</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-black">{totalMeals > 0 ? Math.round(totalCalories / totalMeals) : 0}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Avg/Meal</p>
          </div>
        </div>

        {/* Logs List */}
        {Object.keys(groupedLogs).length === 0 ? (
          <div className="bg-white rounded-[32px] py-12 px-8 text-center border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-black/5">
              <ICONS.Bowl className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm mb-1">No logs found</p>
            <p className="text-slate-300 text-xs">Try adjusting your filters or search</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedLogs).map(([date, logs]: [string, MealAnalysis[]]) => (
              <div key={date}>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{date}</h3>
                <div className="space-y-2.5">
                  {logs.map(meal => (
                    <div 
                      key={meal.id} 
                      className="bg-white rounded-[24px] p-3 shadow-sm border border-black/5 flex gap-4 relative group"
                    >
                      <div 
                        onClick={() => setActiveAnalysis(meal)}
                        className="flex gap-4 flex-1 cursor-pointer hover:bg-slate-50/50 transition-all active:scale-[0.98] rounded-[20px] -m-3 p-3"
                      >
                        <div className="w-20 h-20 rounded-[18px] overflow-hidden flex-shrink-0 bg-slate-100 border border-black/5">
                          <img 
                            src={meal.imageUrl} 
                            className="w-full h-full object-cover" 
                            alt={meal.mealName} 
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=200'; }} 
                          />
                        </div>
                        <div className="flex-1 py-0.5">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className="font-black text-black text-xs truncate max-w-[120px]">{meal.mealName}</h4>
                            <span className="text-[8px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-black/5">
                              {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                           <div className="flex items-center gap-3 mb-2">
                             <div className="flex items-center gap-1">
                               <ICONS.Flame className="w-3 h-3 text-yellow-500" />
                               <span className="font-black text-black text-base">{meal.calories} <span className="text-slate-400 text-[10px] font-bold">Kcal</span></span>
                             </div>
                             <div className="h-3 w-px bg-slate-100" />
                             <div className="flex items-center gap-1">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{meal.ingredients.reduce((s, i) => s + i.weight, 0)}g</span>
                             </div>
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
                      <div className="absolute bottom-3 right-3 flex gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReuse(meal);
                          }}
                          className="w-7 h-7 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center hover:bg-yellow-100 active:scale-90 shadow-sm"
                          title="Reuse this meal"
                        >
                          <ICONS.Refresh className="w-3.5 h-3.5 text-yellow-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete "${meal.mealName}"?`)) {
                              onDeleteLog(currentPet.id, meal.id);
                            }
                          }}
                          className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 active:scale-90 shadow-sm"
                        >
                          <ICONS.Trash className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Analysis Modal */}
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

export default LogsView;
