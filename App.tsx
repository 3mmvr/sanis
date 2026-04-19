
import React, { useState, useEffect } from 'react';
import { UserSession, PetProfile, MealAnalysis, PetType, BowlSize } from './types';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ProgressView from './components/ProgressView';
import SettingsView from './components/SettingsView';
import LogsView from './components/LogsView';
import AuthPage from './components/AuthPage';
import AppOnboarding from './components/AppOnboarding';

const STORAGE_KEY = 'sanis_session';
const AUTH_KEY = 'sanis_auth';
const ONBOARDING_KEY = 'sanis_onboarding_complete';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    fullName: string;
    id: string;
  } | null;
  isGuest: boolean;
}

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) return JSON.parse(saved);
    return {
      isAuthenticated: false,
      user: null,
      isGuest: false
    };
  });

  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  });

  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      pets: [],
      currentPetId: null,
      history: {},
      waterLogs: {},
      isGuest: true
    };
  });

  const [view, setView] = useState<'auth' | 'app-onboarding' | 'landing' | 'onboarding' | 'dashboard' | 'progress' | 'settings' | 'logs'>(() => {
    // If user is authenticated/guest, show appropriate view
    if (authState.isAuthenticated || authState.isGuest) {
      if (!onboardingComplete) return 'app-onboarding';
      if (session.pets.length > 0) return 'dashboard';
      return 'landing';
    }
    // First time visitors see landing page (not auth)
    return 'landing';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  }, [authState]);

  const handleLogin = (email: string, password: string) => {
    // Mock login - in production, this would call Supabase
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName: email.split('@')[0]
    };
    
    setAuthState({
      isAuthenticated: true,
      user,
      isGuest: false
    });

    if (!onboardingComplete) {
      setView('app-onboarding');
    } else {
      setView(session.pets.length > 0 ? 'dashboard' : 'landing');
    }
  };

  const handleSignup = (email: string, password: string, fullName: string) => {
    // Mock signup - in production, this would call Supabase
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName
    };
    
    setAuthState({
      isAuthenticated: true,
      user,
      isGuest: false
    });

    setView('app-onboarding');
  };

  const handleGuestContinue = () => {
    setAuthState({
      isAuthenticated: true,
      user: null,
      isGuest: true
    });

    // Guests skip app onboarding and go directly to pet creation
    setOnboardingComplete(true);
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setView(session.pets.length > 0 ? 'dashboard' : 'onboarding');
  };

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setView(session.pets.length > 0 ? 'dashboard' : 'landing');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? Guest data will be lost.')) {
      localStorage.removeItem(AUTH_KEY);
      if (authState.isGuest) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ONBOARDING_KEY);
        setSession({
          pets: [],
          currentPetId: null,
          history: {},
          isGuest: true
        });
        setOnboardingComplete(false);
      }
      setAuthState({
        isAuthenticated: false,
        user: null,
        isGuest: false
      });
      setView('auth');
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const handleAddPet = (pet: PetProfile) => {
    // Deterministically compute and set the new session, then navigate to dashboard.
    setOnboardingComplete(true);
    localStorage.setItem(ONBOARDING_KEY, 'true');

    const newSession: UserSession = {
      ...session,
      pets: [...session.pets, pet],
      currentPetId: session.currentPetId || pet.id,
      isGuest: false
    };

    console.log('[App] handleAddPet - newSession:', newSession);
    setSession(newSession);
    setView('dashboard');
  };

  const handleUpdatePet = (updatedPet: PetProfile) => {
    setSession(prev => ({
      ...prev,
      pets: prev.pets.map(p => p.id === updatedPet.id ? updatedPet : p)
    }));
  };

  const handleDeletePet = (petId: string) => {
    setSession(prev => {
      const newPets = prev.pets.filter(p => p.id !== petId);
      const newCurrentPetId = prev.currentPetId === petId 
        ? (newPets.length > 0 ? newPets[0].id : null)
        : prev.currentPetId;
      
      // Also clean up history for this pet
      const newHistory = { ...prev.history };
      delete newHistory[petId];

      return {
        ...prev,
        pets: newPets,
        currentPetId: newCurrentPetId,
        history: newHistory,
        isGuest: newPets.length === 0
      };
    });

    if (session.pets.length <= 1) {
      setView('landing');
    }
  };

  const handleUpdateHistory = (petId: string, analysis: MealAnalysis) => {
    setSession(prev => {
      const petHistory = prev.history[petId] || [];
      return {
        ...prev,
        history: {
          ...prev.history,
          [petId]: [analysis, ...petHistory]
        }
      };
    });
  };

  const handleDeleteLog = (petId: string, logId: string) => {
    setSession(prev => {
      const petHistory = prev.history[petId] || [];
      return {
        ...prev,
        history: {
          ...prev.history,
          [petId]: petHistory.filter(log => log.id !== logId)
        }
      };
    });
  };

  const handleUpdateLog = (petId: string, updatedLog: MealAnalysis) => {
    setSession(prev => {
      const petHistory = prev.history[petId] || [];
      return {
        ...prev,
        history: {
          ...prev.history,
          [petId]: petHistory.map(log => log.id === updatedLog.id ? updatedLog : log)
        }
      };
    });
  };

  const currentPet = session.pets.find(p => p.id === session.currentPetId) || null;

  useEffect(() => {
    console.log('[App] State update -> view:', view, 'currentPetId:', session.currentPetId, 'pets.length:', session.pets.length, 'currentPet:', currentPet);
  }, [view, session, currentPet]);

  return (
    <div className="min-h-screen">
      {view === 'auth' && (
        <AuthPage 
          onLogin={handleLogin}
          onSignup={handleSignup}
          onGuestContinue={handleGuestContinue}
        />
      )}
      {view === 'app-onboarding' && (
        <AppOnboarding onComplete={handleOnboardingComplete} />
      )}
      {view === 'landing' && (
        <LandingPage 
          onGetStarted={() => setView('auth')} 
          onSignIn={() => setView('auth')}
        />
      )}
      {view === 'onboarding' && (
        <Onboarding onComplete={handleAddPet} onBack={() => setView(session.pets.length > 0 ? 'dashboard' : 'landing')} />
      )}
      {view === 'dashboard' && currentPet && (
        <Dashboard 
          session={session} 
          currentPet={currentPet} 
          onPetSelect={(id) => setSession(s => ({ ...s, currentPetId: id }))}
          onAddPet={() => setView('onboarding')}
          onUpdateHistory={handleUpdateHistory}
          onDeleteLog={handleDeleteLog}
          onUpdateLog={handleUpdateLog}
          onUpdateSession={setSession}
          onNavigate={(v) => setView(v as any)}
        />
      )}
      {view === 'progress' && currentPet && (
        <ProgressView 
          session={session}
          currentPet={currentPet}
          onBack={() => setView('dashboard')}
          onNavigate={(v) => setView(v as any)}
        />
      )}
      {view === 'settings' && (
        <SettingsView 
          session={session}
          authState={authState}
          onBack={() => setView('dashboard')}
          onNavigate={(v) => setView(v as any)}
          onAddPet={() => setView('onboarding')}
          onUpdateSession={(s) => setSession(s)}
          onUpdatePet={handleUpdatePet}
          onDeletePet={handleDeletePet}
          onLogout={handleLogout}
        />
      )}
      {view === 'logs' && currentPet && (
        <LogsView 
          session={session}
          currentPet={currentPet}
          onBack={() => setView('dashboard')}
          onNavigate={(v) => setView(v as any)}
          onDeleteLog={handleDeleteLog}
          onUpdateLog={handleUpdateLog}
        />
      )}
    </div>
  );
};

export default App;
