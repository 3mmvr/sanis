
import React from 'react';
import { ICONS } from '../constants';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="px-6 py-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <ICONS.Scan className="text-yellow-400 w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight">sanis</span>
        </div>
        <button 
          onClick={onSignIn}
          className="font-bold text-sm bg-slate-50 px-6 py-2.5 rounded-full hover:bg-slate-100 transition-all"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <main className="px-6 py-12 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-600 px-4 py-1.5 rounded-full mb-6">
          <ICONS.Flame className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">AI for Better Pet Nutrition</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-5 leading-[0.95]">
          The only app your <br/> 
          <span className="text-yellow-400">pet needs to thrive.</span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-10">
          Clinical-grade food tracking, calorie counting, and health monitoring. Extend your best friend's life with AI-driven metabolic precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-[24px] font-black text-lg shadow-2xl hover:scale-105 transition-all"
          >
            Start Tracking Free
          </button>
          <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-[24px]">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-10 h-10 rounded-full border-4 border-slate-50" />
               ))}
             </div>
             <p className="text-sm font-bold text-slate-600">Loved by Pet Owners Everywhere</p>
          </div>
        </div>

        {/* Demo Image */}
        <div className="mt-20 relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-yellow-400 blur-[120px] opacity-20 rounded-full animate-pulse" />
          <div className="relative bg-white border-[12px] border-slate-100 rounded-[60px] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=2000" 
              className="w-full aspect-video object-cover" 
              alt="Pet AI Dashboard Preview"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-left">
               <h3 className="text-white text-2xl font-black mb-2">High Accuracy</h3>
               <p className="text-white/80 font-bold text-sm">Simply snap a photo of their bowl to instantly log calories and macros.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-24 px-6 mt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Vision Log",
              desc: "Our neural network identifies protein sources, grains, and raw additions in seconds.",
              icon: <ICONS.Scan className="w-8 h-8 text-black" />
            },
            {
              title: "Weight Forecast",
              desc: "Predict health trends and adjust portions based on real-time activity data.",
              icon: <ICONS.Chart className="w-8 h-8 text-black" />
            },
            {
              title: "Vet-Level Insights",
              desc: "Receive clinically-backed advice tailored to your pet's breed and life stage.",
              icon: <ICONS.Microscope className="w-8 h-8 text-black" />
            }
          ].map((feat, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-5">
                {feat.icon}
              </div>
              <h4 className="text-xl font-black mb-2">{feat.title}</h4>
              <p className="text-slate-400 font-bold leading-relaxed text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 font-bold text-sm">
        &copy; 2024 sanis AI. Designed for longevity.
      </footer>
    </div>
  );
};

export default LandingPage;
