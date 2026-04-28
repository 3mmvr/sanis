
import React, { useMemo, useState } from 'react';
import { UserSession, PetProfile } from '../types';
import { ICONS } from '../constants';
import { calculateStreak, calculateWeeklyStats } from '../utils/streakCalculator';

interface ProgressViewProps {
  session: UserSession;
  currentPet?: PetProfile;
  onBack: () => void;
  onNavigate: (view: string) => void;
  onAddPet: () => void;
}

type TimeFilter = 'week' | 'month' | '6months' | '12months';

const ProgressView: React.FC<ProgressViewProps> = ({ session, currentPet, onBack, onNavigate, onAddPet }) => {
  const history = currentPet ? (session.history[currentPet.id] || []) : [];
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  
  const streakData = useMemo(() => calculateStreak(history), [history]);
  const weeklyStats = useMemo(() => calculateWeeklyStats(history), [history]);

  const { dataPoints, labels, journeyStart } = useMemo(() => {
    if (history.length === 0) {
      return { dataPoints: [0, 0, 0, 0, 0, 0, 0], labels: ['-','-','-','-','-','-','-'], journeyStart: new Date() };
    }
    
    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);
    const journeyStart = new Date(sorted[0].timestamp);
    journeyStart.setHours(0, 0, 0, 0);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let daysToShow = 7;
    let groupByDays = 1;
    
    switch (timeFilter) {
      case 'week': daysToShow = 7; groupByDays = 1; break;
      case 'month': daysToShow = 30; groupByDays = 1; break;
      case '6months': daysToShow = 180; groupByDays = 7; break;
      case '12months': daysToShow = 365; groupByDays = 30; break;
    }

    // Determine window start: either Journey Start or (Today - daysToShow)
    const windowStart = new Date(today);
    windowStart.setDate(windowStart.getDate() - (daysToShow - 1));
    
    // If we're in the first week/month, we might want to start from Journey Start to avoid empty leading bars
    const actualStart = journeyStart > windowStart ? journeyStart : windowStart;
    
    const dataArray: number[] = [];
    const labelArray: string[] = [];
    const periods = Math.ceil(daysToShow / groupByDays);

    for (let i = 0; i < periods; i++) {
      const d = new Date(actualStart);
      d.setDate(d.getDate() + (i * groupByDays));
      
      const periodEnd = new Date(d);
      periodEnd.setDate(d.getDate() + groupByDays);
      
      const total = history
        .filter(m => {
          const mDate = new Date(m.timestamp);
          return mDate >= d && mDate < periodEnd;
        })
        .reduce((sum, m) => sum + m.calories, 0);
      
      dataArray.push(groupByDays > 1 ? total / groupByDays : total);
      
      // Dynamic Labels
      if (timeFilter === 'week') {
        labelArray.push(d.toLocaleDateString([], { weekday: 'short' }));
      } else if (timeFilter === 'month') {
        labelArray.push(i % 7 === 0 ? d.toLocaleDateString([], { month: 'short', day: 'numeric' }) : '');
      } else {
        labelArray.push(d.toLocaleDateString([], { month: 'short' }));
      }
    }
    
    return { dataPoints: dataArray, labels: labelArray, journeyStart };
  }, [history, timeFilter]);

  const maxVal = Math.max(...dataPoints, 1200);
  const minVal = Math.min(...dataPoints.filter(v => v > 0), 0);
  const range = maxVal - minVal || 1;

  // SVG Path generation
  const chartWidth = 300;
  const chartHeight = 160;
  const points = dataPoints.map((val, i) => {
    const x = (i / (dataPoints.length - 1)) * chartWidth;
    const y = chartHeight - ((val - minVal) / range) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,${chartHeight} L ${points.join(' L ')} L ${chartWidth},${chartHeight} Z`;

  if (!currentPet) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F8F8F8] pb-36">
        <header className="px-6 pt-8 pb-5 flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-black bg-white rounded-full shadow-sm border border-black/5 active:scale-90 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-black text-black tracking-tight">Health Analytics</h1>
        </header>
        <main className="px-6">
          <div className="bg-orange-50 border border-orange-200 rounded-[24px] p-5 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="flex-1">
              <p className="text-orange-900 font-black text-sm mb-1 leading-tight">No Pet Profile Found</p>
              <p className="text-orange-700 text-[11px] font-bold leading-relaxed mb-3">
                Please add at least one pet to enable health tracking and nutritional insights.
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
        <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-black/5 pt-4 pb-8 z-40">
          <div className="max-w-md mx-auto px-6 flex justify-between items-center relative">
            <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center gap-1 text-slate-300 hover:text-black transition-colors">
              <ICONS.Home className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-black">
              <ICONS.Chart className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Progress</span>
            </button>
            <button onClick={() => onNavigate('settings')} className="flex flex-col items-center gap-1 text-slate-300 hover:text-black transition-colors">
              <ICONS.Settings className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Settings</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8F8F8] pb-36">
       <header className="px-6 pt-8 pb-5 flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-black bg-white rounded-full shadow-sm border border-black/5 active:scale-90 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-black text-black tracking-tight">Health Analytics</h1>
       </header>

       <main className="px-6 space-y-4">
          {/* Summary Row */}
          <div className="grid grid-cols-2 gap-3.5">
             <div className="bg-white rounded-[28px] p-5 border border-black/5 shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Weight Metric</p>
                <div className="flex items-baseline gap-1 mb-3">
                   <span className="text-2xl font-black text-black">{currentPet.weight.toFixed(1)}</span>
                   <span className="text-slate-400 font-bold text-xs uppercase">kg</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full border border-black/5 overflow-hidden">
                   <div className="h-full bg-black rounded-full" style={{ width: '80%' }} />
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase mt-2 text-center tracking-wider">Goal: {Math.round(currentPet.weight * 1.1)} kg</p>
             </div>

             <div className="bg-white rounded-[28px] p-5 border border-black/5 shadow-sm flex flex-col items-center justify-center">
                <div className="relative mb-1">
                   <ICONS.Flame className="w-10 h-10 text-yellow-400" />
                   <span className="absolute inset-0 flex items-center justify-center pt-2 text-sm font-black text-white">{streakData.currentStreak}</span>
                </div>
                <p className="text-[9px] font-black text-black uppercase tracking-widest">Current Streak</p>
                {streakData.longestStreak > streakData.currentStreak && (
                  <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Best: {streakData.longestStreak} days</p>
                )}
                <div className="flex gap-1 mt-3">
                   {streakData.streakDays.map((hasLog, i) => (
                     <div key={i} className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black ${hasLog ? 'bg-yellow-400 text-white shadow-sm shadow-yellow-400/20' : 'bg-slate-50 text-slate-300 border border-black/5'}`}>
                        {hasLog ? '✓' : ''}
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Precision Chart Card */}
          <div className="bg-white rounded-[32px] p-5 border border-black/5 shadow-sm overflow-hidden">
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h3 className="text-base font-black text-black">Metabolic Trend</h3>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5">Calories vs Activity</p>
                </div>
                <div className="bg-green-50 px-2.5 py-1 rounded-lg border border-green-100 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">In Range</span>
                </div>
             </div>

             <div className="relative h-44 w-full mb-10 px-2">
                {/* Precision Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between text-[8px] font-black text-slate-300 pointer-events-none pr-8">
                   <div className="flex items-center gap-4"><span className="w-6 text-right">{maxVal}</span><div className="flex-1 h-px bg-slate-50" /></div>
                   <div className="flex items-center gap-4"><span className="w-6 text-right">{Math.round((maxVal + minVal)/2)}</span><div className="flex-1 h-px bg-slate-50" /></div>
                   <div className="flex items-center gap-4"><span className="w-6 text-right">{minVal}</span><div className="flex-1 h-px bg-slate-50" /></div>
                </div>

                <div className="absolute inset-0 pl-10">
                   <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                      {/* Gradient Area */}
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaD} fill="url(#chartGrad)" />
                      {/* Main Line */}
                      <path d={pathD} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {/* Current Point */}
                      <circle cx={points[points.length-1].split(',')[0]} cy={points[points.length-1].split(',')[1]} r="4" fill="#22C55E" stroke="white" strokeWidth="2" />
                   </svg>
                   
                   {/* Tooltip Mockup */}
                   {dataPoints.length > 1 && dataPoints[dataPoints.length - 2] > 0 && (
                   <div className="absolute top-[30%] left-[65%] bg-black text-white px-3 py-1.5 rounded-xl shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full flex flex-col items-center">
                      <p className="text-[10px] font-black leading-none">{Math.round(dataPoints[dataPoints.length-2])} Kcal</p>
                      <p className="text-[7px] font-bold text-white/50 uppercase tracking-widest mt-0.5">Yesterday</p>
                      <div className="w-2 h-2 bg-black rotate-45 absolute -bottom-1" />
                   </div>
                   )}
                </div>

                <div className="absolute -bottom-6 left-10 right-0 flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
                   {labels.filter((_, i) => i % (timeFilter === 'week' ? 2 : 7) === 0).map((l, i) => (
                     <span key={i}>{l || `Day ${i*7 + 1}`}</span>
                   ))}
                </div>
             </div>

             <div className="flex bg-slate-50/50 border border-black/5 p-1 rounded-2xl gap-1">
                {[
                  { key: 'week', label: 'This Week' },
                  { key: 'month', label: 'This Month' },
                  { key: '6months', label: 'Past 6M' },
                  { key: '12months', label: 'Past 12M' }
                ].map(({ key, label }) => (
                  <button 
                    key={key} 
                    onClick={() => setTimeFilter(key as TimeFilter)}
                    className={`flex-1 py-2 text-[9px] font-black rounded-xl transition-all ${timeFilter === key ? 'bg-white shadow-sm text-black border border-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {label}
                  </button>
                ))}
             </div>
          </div>

          {/* Refined Bar Chart */}
          <div className="bg-white rounded-[32px] p-5 border border-black/5 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 text-center">Average Intake Cycle</p>
             <div className="flex items-baseline justify-center gap-1.5 mb-6">
                <span className="text-2xl font-black text-black tracking-tighter">{Math.round(weeklyStats.weeklyAverage)}</span>
                <span className="text-slate-400 font-bold text-xs uppercase">cal/day</span>
                {weeklyStats.percentChange !== 0 && (
                <div className={`px-1.5 py-0.5 rounded-md ml-2 ${weeklyStats.percentChange > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                   <span className={`font-black text-[9px] ${weeklyStats.percentChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {weeklyStats.percentChange > 0 ? '↑' : '↓'} {Math.abs(Math.round(weeklyStats.percentChange))}%
                   </span>
                </div>
                )}
             </div>
             <div className="flex items-end justify-between h-20 gap-3 px-2">
                {dataPoints.slice(0, 7).map((calories, i) => {
                  const maxCalories = Math.max(...dataPoints.slice(0, 7), 1);
                  const height = maxCalories > 0 ? (calories / maxCalories) * 100 : 0;
                  const d = new Date(journeyStart);
                  d.setDate(d.getDate() + i);
                  const isToday = d.toDateString() === new Date().toDateString();
                  
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-t-lg transition-all duration-700 ${isToday && calories > 0 ? 'bg-yellow-400' : calories > 0 ? 'bg-slate-200 hover:bg-slate-300' : 'bg-slate-50'}`} 
                      style={{ height: `${Math.max(height, 5)}%` }} 
                    />
                  );
                })}
             </div>
             <div className="flex justify-between mt-3 px-2 text-[8px] font-black text-slate-300 uppercase">
                {labels.slice(0, 7).map((l, i) => <span key={i}>{l}</span>)}
             </div>
          </div>
       </main>

       {/* Bottom Nav - Consistent Sizing */}
       <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-black/5 pt-4 pb-8 z-40">
        <div className="max-w-md mx-auto px-6 flex justify-between items-center relative">
          <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center gap-1 text-slate-300 hover:text-black transition-colors">
            <ICONS.Home className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-black">
            <ICONS.Chart className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-widest">Progress</span>
          </button>
          <button onClick={() => onNavigate('settings')} className="flex flex-col items-center gap-1 text-slate-300 hover:text-black transition-colors">
            <ICONS.Settings className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-widest">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ProgressView;
