import React, { useState } from 'react';
import { ICONS } from '../constants';

interface AppOnboardingProps {
  userName?: string;
  onComplete: () => void;
}

const AppOnboarding: React.FC<AppOnboardingProps> = ({ onComplete, userName }) => {
  const [currentStage, setCurrentStage] = useState(1);

  const handleNext = () => {
    if (currentStage < 5) {
      setCurrentStage(currentStage + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const stages = [
    {
      title: userName ? `Welcome, ${userName}` : "Welcome to Sanis",
      subtitle: "Where your pet's health becomes your mission",
      icon: "🎯",
      description: "Track nutrition with AI precision. Just like you count your calories, now count theirs.",
      points: [
        "Clinical-grade food analysis",
        "Real-time calorie tracking",
        "Personalized health insights"
      ]
    },
    {
      title: "Why Nutrition Matters",
      subtitle: "Your pet's longevity depends on what they eat",
      icon: "❤️",
      description: "Proper nutrition can extend your pet's life by 2-3 years. 75% of pets are overweight or obese.",
      points: [
        "Prevent obesity and diabetes",
        "Support joint and organ health",
        "Extend their life expectancy"
      ]
    },
    {
      title: "AI-Powered Scanning",
      subtitle: "Food analysis in seconds",
      icon: "📸",
      description: "Our advanced AI analyzes every meal with veterinary-grade precision.",
      points: [
        "Snap a photo of their bowl",
        "AI identifies calories & macros",
        "Get instant nutrition advice"
      ]
    },
    {
      title: "Streaks & Goals",
      subtitle: "Build healthy habits together",
      icon: "🔥",
      description: "Log daily to maintain your streak. Your dedication equals their vitality.",
      points: [
        "Track daily logging streaks",
        "Set weight and health goals",
        "Monitor progress over time"
      ]
    },
    {
      title: "Ready to Start?",
      subtitle: "Everything you need in one app",
      icon: "🐾",
      description: "You care about your health. They deserve the same precision and dedication.",
      points: [
        "Multi-pet support",
        "Hydration tracking",
        "Complete health analytics"
      ]
    }
  ];

  const stage = stages[currentStage - 1];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex gap-2">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < currentStage ? 'bg-yellow-400' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Skip Button */}
      <div className="px-6">
        <button
          onClick={handleSkip}
          className="text-sm font-black text-slate-400 hover:text-black transition-colors uppercase tracking-widest"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col justify-center items-center text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-8 animate-in fade-in zoom-in duration-500">
          <div className="w-32 h-32 bg-yellow-400/10 rounded-full flex items-center justify-center text-7xl">
            {stage.icon}
          </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-black text-black mb-2 tracking-tight">
            {stage.title}
          </h1>
          <p className="text-slate-400 font-bold text-sm mb-6">
            {stage.subtitle}
          </p>
          <p className="text-slate-600 font-medium text-base leading-relaxed mb-8">
            {stage.description}
          </p>

          {/* Feature Points */}
          <div className="space-y-3 mb-10">
            {stage.points.map((point, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-left bg-slate-50 px-5 py-3 rounded-2xl border border-black/5"
              >
                <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                <span className="text-sm font-bold text-black">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <button
          onClick={handleNext}
          className="w-full bg-black text-white py-4 rounded-[24px] font-black text-base shadow-xl hover:opacity-90 transition-all"
        >
          {currentStage === 5 ? 'Get Started' : 'Continue'}
        </button>

        {/* Stage Indicator */}
        <p className="text-center mt-4 text-xs font-black text-slate-300 uppercase tracking-widest">
          Stage {currentStage} of 5
        </p>
      </div>
    </div>
  );
};

export default AppOnboarding;
