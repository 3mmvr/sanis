
import React, { useMemo, useState } from 'react';
import { UserSession, PetProfile } from '../types';
import { ICONS } from '../constants';
import { calculateStreak, calculateWeeklyStats } from '../utils/streakCalculator';

interface ProgressViewProps {
  session: UserSession;
  currentPet: PetProfile;
  onBack: () => void;
  onNavigate: (view: string) => void;
}

type TimeFilter = 'week' | 'month' | '6months' | '12months';

const ProgressView: React.FC<ProgressViewProps> = ({ session, currentPet, onBack, onNavigate }) => {
  const history = session.history[currentPet.id] || [];
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  
  const streakData = useMemo(() => calculateStreak(history), [history]);
  const weeklyStats = useMemo(() => calculateWeeklyStats(history), [history]);

  const dataPoints = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    let daysToShow: number;
    let groupByDays: number;
    
    switch (timeFilter) {
      case 'week': daysToShow = 7; groupByDays = 1; break;
      case 'month': daysToShow = 30; groupByDays = 1; break;
      case '6months': daysToShow = 180; groupByDays = 7; break;
      case '12months': daysToShow = 365; groupByDays = 30; break;
      default: daysToShow = 7; groupByDays = 1;
    }
    
    const result: number[] = [];
    const periods = Math.ceil(daysToShow / groupByDays);
    
    for (let i = periods - 1; i >= 0; i--) {
      const periodEnd = new Date(today);
      periodEnd.setDate(today.getDate() - (i * groupByDays));
      
      const periodStart = new Date(periodEnd);
      periodStart.setDate(periodEnd.getDate() - groupByDays + 1);
      periodStart.setHours(0, 0, 0, 0);
      
      const periodTotal = history
        .filter(meal => {
          const mDate = new Date(meal.timestamp);
          return mDate >= periodStart && mDate <= periodEnd;
        })
        .reduce((sum, meal) => sum + (meal.calories || 0), 0);
      
      result.push(groupByDays > 1 ? periodTotal / groupByDays : periodTotal);
    }
    
    return result;
  }, [history, timeFilter]);

  const maxVal = Math.max(...dataPoints, 1200);
  const minVal = 0;
  const range = maxVal || 1200;

  // SVG Path generation
  const chartWidth = 300;
  const chartHeight = 160;
  
  const points = dataPoints.map((val, i) => {
    const x = dataPoints.length > 1 ? (i / (dataPoints.length - 1)) * chartWidth : chartWidth / 2;
    const y = chartHeight - (val / range) * chartHeight;
    return { x, y, val };
  });

  const pathD = points.length > 1 
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` 
    : `M ${points[0].x - 10},${points[0].y} L ${points[0].x + 10},${points[0].y}`;
    
  const areaD = points.length > 1
    ? `M 0,${chartHeight} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${chartWidth},${chartHeight} Z`
    : `M ${points[0].x - 10},${chartHeight} L ${points[0].x - 10},${points[0].y} L ${points[0].x + 10},${points[0].y} L ${points[0].x + 10},${chartHeight} Z`;


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
                      {points.length > 0 && (
                        <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="4" fill="#22C55E" stroke="white" strokeWidth="2" />
                      )}
                   </svg>
                   
                   {/* Tooltip Mockup */}
                   {dataPoints.length > 1 && dataPoints[dataPoints.length - 1] > 0 && (
                   <div className="absolute bg-black text-white px-3 py-1.5 rounded-xl shadow-2xl pointer-events-none flex flex-col items-center z-10" 
                        style={{ 
                          left: `${(points[points.length-1].x / chartWidth) * 100}%`,
                          top: `${(points[points.length-1].y / chartHeight) * 100}%`,
                          transform: 'translate(-50%, -140%)'
                        }}>
                      <p className="text-[10px] font-black leading-none">{Math.round(dataPoints[dataPoints.length-1])} Kcal</p>
                      <p className="text-[7px] font-bold text-white/50 uppercase tracking-widest mt-0.5">Today</p>
                      <div className="w-2 h-2 bg-black rotate-45 absolute -bottom-1" />
                   </div>
                   )}
                </div>

                <div className="absolute -bottom-6 left-10 right-0 flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
                   {timeFilter === 'week' && (
                     <>
                       <span>Day 1</span><span>Day 3</span><span>Day 5</span><span>Day 7</span>
                     </>
                   )}
                   {timeFilter === 'month' && (
                     <>
                       <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
                     </>
                   )}
                   {timeFilter === '6months' && (
                     <>
                       <span>Mo 1</span><span>Mo 2</span><span>Mo 3</span><span>Mo 4</span><span>Mo 5</span><span>Mo 6</span>
                     </>
                   )}
                   {timeFilter === '12months' && (
                     <>
                       <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                     </>
                   )}
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
                {weeklyStats.dailyCalories.map((calories, i) => {
                  const maxCalories = Math.max(...weeklyStats.dailyCalories, 1);
                  const height = maxCalories > 0 ? (calories / maxCalories) * 100 : 0;
                  const isToday = i === 6;
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
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
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
