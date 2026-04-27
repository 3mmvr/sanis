import React, { useState } from 'react';
import { ICONS } from '../constants';

interface AuthPageProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, fullName: string) => void;
  onGuestContinue: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, onGuestContinue }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (isLogin) {
        onLogin(email, password);
      } else {
        onSignup(email, password, fullName);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <ICONS.Scan className="text-yellow-400 w-7 h-7" />
          </div>
          <span className="text-3xl font-black tracking-tight">sanis</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-black mb-2 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Start Your Journey'}
          </h1>
          <p className="text-slate-500 font-bold text-sm">
            {isLogin 
              ? 'Continue tracking your pet\'s nutrition' 
              : 'Give your pet the care they deserve'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required={!isLogin}
                className="w-full bg-slate-50 border border-black/5 rounded-[20px] px-5 py-4 text-black font-bold focus:ring-2 ring-yellow-400 outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-slate-50 border border-black/5 rounded-[20px] px-5 py-4 text-black font-bold focus:ring-2 ring-yellow-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-slate-50 border border-black/5 rounded-[20px] px-5 py-4 text-black font-bold focus:ring-2 ring-yellow-400 outline-none transition-all"
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-xs font-black text-slate-400 hover:text-black transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-[24px] font-black text-base shadow-xl hover:opacity-90 disabled:opacity-50 transition-all mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Google Login (Coming Soon) */}
        <div className="mt-8">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-4 rounded-[24px] font-black text-slate-400 cursor-not-allowed opacity-60 filter grayscale"
            onClick={() => alert("Google Login will be available soon! Please use email or Guest Mode for testing.")}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#34A853" d="M9.64 28.91c-.61-1.84-.95-3.81-.95-5.91s.34-4.07.95-5.91l-7.98-6.19C.92 15.46 0 19.59 0 24s.92 8.54 2.61 13.09l7.03-5.09z"/>
              <path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.03 5.09C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google (Coming Soon)
          </button>
        </div>

        {/* Toggle Auth Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-slate-500"
          >
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span className="text-black underline">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </button>
        </div>

        {/* Guest Mode */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-slate-400 font-black uppercase tracking-widest">
                Or
              </span>
            </div>
          </div>

          <button
            onClick={onGuestContinue}
            className="w-full mt-6 border-2 border-slate-200 text-slate-600 py-4 rounded-[24px] font-black text-base hover:border-black hover:text-black transition-all"
          >
            Continue as Guest
          </button>
          <p className="text-center text-xs text-slate-400 font-bold mt-3">
            Your data will be stored locally on this device
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <p className="text-center text-xs text-yellow-800 font-black">
              💡 For testing, please use Guest Account
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 text-center text-slate-400 text-xs font-bold">
        <p>By continuing, you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  );
};

export default AuthPage;
