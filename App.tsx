
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { UserSession, PetProfile, MealAnalysis, PetType, BowlSize } from './types';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ProgressView from './components/ProgressView';
import SettingsView from './components/SettingsView';
import LogsView from './components/LogsView';
import AppOnboarding from './components/AppOnboarding';
// New page imports
import About from './pages/About';
import TC from './pages/TC';
import Video from './pages/Video';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { secureStorage } from './utils/storageService';

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

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isGuest: false
  });

  useEffect(() => {
    const apiKey = (import.meta.env.VITE_API_KEY || '').replace(/[$'"\s]/g, '').trim();
    const maskedKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'N/A';
    console.log(`[Auth] API Key: ${maskedKey} | Length: ${apiKey.length}`);
  }, []);

  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const [session, setSession] = useState<UserSession>({
    pets: [],
    currentPetId: null,
    history: {},
    waterLogs: {},
    isGuest: true
  });

  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  useEffect(() => {
    const initStorage = async () => {
      const savedAuth = await secureStorage.getItem<AuthState>(AUTH_KEY);
      if (savedAuth) setAuthState(savedAuth);

      const savedOnboarding = await secureStorage.getItem<string>(ONBOARDING_KEY);
      if (savedOnboarding === 'true') setOnboardingComplete(true);

      const savedSession = await secureStorage.getItem<UserSession>(STORAGE_KEY);
      if (savedSession) setSession(savedSession);

      setIsStorageLoaded(true);
    };
    initStorage();
  }, []);

  const hasInitialNav = useRef(false);

  // Initial navigation — runs ONCE on mount only.
  // Do NOT re-run on every state change; that overrides user-initiated navigation.
  const location = useLocation();

  // Navigation Guard: Prevent authenticated users from going back to Login/SignUp/Onboarding
  useEffect(() => {
    const isAuthenticated = authState.isAuthenticated && !authState.isGuest;
    const authRoutes = ['/login', '/signup'];
    const onboardingRoutes = ['/app-onboarding', '/onboarding'];
    
    if (isAuthenticated && authRoutes.includes(location.pathname)) {
      // ONLY redirect away from Login/SignUp if they are truly authenticated (not guest)
      navigate(session.pets.length > 0 ? '/dashboard' : '/landing', { replace: true });
    } else if ((authState.isAuthenticated || authState.isGuest) && onboardingRoutes.includes(location.pathname) && session.pets.length > 0) {
      // Both guests and real users should skip onboarding if they already have pets
      navigate('/dashboard', { replace: true });
    }
  }, [location.pathname, authState.isAuthenticated, authState.isGuest, session.pets.length, navigate]);

  useEffect(() => {
    if (hasInitialNav.current) return; // already navigated once
    // Public routes that should never be auto-redirected
    const publicRoutes = ['/login', '/signup', '/about', '/tc', '/video', '/landing'];
    if (publicRoutes.includes(location.pathname)) {
      hasInitialNav.current = true;
      return;
    }
    if (authState.isAuthenticated || authState.isGuest) {
      hasInitialNav.current = true;
      if (!onboardingComplete) {
        navigate('/app-onboarding');
      } else if (session.pets.length > 0) {
        navigate('/dashboard');
      } else {
        navigate('/landing');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStorageLoaded]); // intentionally wait for storage load


  useEffect(() => {
    if (isStorageLoaded) secureStorage.setItem(STORAGE_KEY, session);
  }, [session, isStorageLoaded]);

  useEffect(() => {
    if (isStorageLoaded) secureStorage.setItem(AUTH_KEY, authState);
  }, [authState, isStorageLoaded]);

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
      navigate('/app-onboarding', { replace: true });
    } else {
      navigate(session.pets.length > 0 ? '/dashboard' : '/landing', { replace: true });
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

    navigate('/app-onboarding', { replace: true });
  };

  const handleGuestContinue = () => {
    setAuthState({
      isAuthenticated: true,
      user: null,
      isGuest: true
    });

    // Guests skip app onboarding and go directly to pet creation
    setOnboardingComplete(true);
    secureStorage.setItem(ONBOARDING_KEY, 'true');
    navigate(session.pets.length > 0 ? '/dashboard' : '/onboarding', { replace: true });
  };

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    secureStorage.setItem(ONBOARDING_KEY, 'true');
    navigate(session.pets.length > 0 ? '/dashboard' : '/landing');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? Guest data will be lost.')) {
      secureStorage.removeItem(AUTH_KEY);
      if (authState.isGuest) {
        secureStorage.removeItem(STORAGE_KEY);
        secureStorage.removeItem(ONBOARDING_KEY);
        setSession({
          pets: [],
          currentPetId: null,
          history: {},
          isGuest: true,
          waterLogs: {}
        });
        setOnboardingComplete(false);
      }
      setAuthState({
        isAuthenticated: false,
        user: null,
        isGuest: false
      });
      navigate('/', { replace: true });
    }
  };

  const handleAddPet = (pet: PetProfile) => {
    // Deterministically compute and set the new session, then navigate to dashboard.
    setOnboardingComplete(true);
    secureStorage.setItem(ONBOARDING_KEY, 'true');

    const newSession: UserSession = {
      ...session,
      pets: [...session.pets, pet],
      currentPetId: session.currentPetId || pet.id,
      isGuest: false
    };

    console.log('[App] handleAddPet - newSession:', newSession);
    setSession(newSession);
    navigate('/dashboard');
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
      navigate('/landing');
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
    console.log('[App] State update -> currentPetId:', session.currentPetId, 'pets.length:', session.pets.length, 'currentPet:', currentPet);
  }, [session, currentPet]);

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={
          <Login
            onLogin={handleLogin}
            onSignupClick={() => navigate('/signup')}
            onGuestContinue={handleGuestContinue}
          />
        } />
        <Route path="/signup" element={
          <SignUp
            onSignup={handleSignup}
            onLoginClick={() => navigate('/login')}
            onGuestContinue={handleGuestContinue}
          />
        } />
        <Route path="/app-onboarding" element={
          <AppOnboarding onComplete={handleOnboardingComplete} />
        } />
        <Route path="/landing" element={
          <LandingPage 
            onGetStarted={() => navigate('/login')} 
            onSignIn={() => navigate('/login')}
          />
        } />
        <Route path="/onboarding" element={
          <Onboarding onComplete={handleAddPet} onBack={() => navigate(session.pets.length > 0 ? '/dashboard' : '/landing')} />
        } />
        <Route path="/dashboard" element={currentPet ? (
          <Dashboard 
            session={session} 
            currentPet={currentPet} 
            onPetSelect={(id) => setSession(s => ({ ...s, currentPetId: id }))}
            onAddPet={() => navigate('/onboarding')}
            onUpdateHistory={handleUpdateHistory}
            onDeleteLog={handleDeleteLog}
            onUpdateLog={handleUpdateLog}
            onUpdateSession={setSession}
            onNavigate={(path) => navigate(path)}
          />
        ) : <LandingPage onGetStarted={() => navigate('/login')} onSignIn={() => navigate('/login')} />} />
        <Route path="/progress" element={currentPet ? (
          <ProgressView 
            session={session}
            currentPet={currentPet}
            onBack={() => navigate('/dashboard')}
            onNavigate={(path) => navigate(path)}
          />
        ) : <LandingPage onGetStarted={() => navigate('/login')} onSignIn={() => navigate('/login')} />} />
        <Route path="/settings" element={
          <SettingsView 
            session={session}
            authState={authState}
            onBack={() => navigate('/dashboard')}
            onNavigate={(path) => navigate(path)}
            onAddPet={() => navigate('/onboarding')}
            onUpdateSession={(s) => setSession(s)}
            onUpdatePet={handleUpdatePet}
            onDeletePet={handleDeletePet}
            onLogout={handleLogout}
          />
        } />
        <Route path="/logs" element={currentPet ? (
          <LogsView 
            session={session}
            currentPet={currentPet}
            onBack={() => navigate('/dashboard')}
            onNavigate={(path) => navigate(path)}
            onDeleteLog={handleDeleteLog}
            onUpdateLog={handleUpdateLog}
          />
        ) : <LandingPage onGetStarted={() => navigate('/login')} onSignIn={() => navigate('/login')} />} />
        <Route path="/about" element={<About />} />
        <Route path="/tc" element={<TC />} />
        <Route path="/video" element={<Video />} />
        <Route path="/" element={<LandingPage onGetStarted={() => navigate('/signup')} onSignIn={() => navigate('/login')} />} />
        {/* Default route - redirect to landing based on auth state */}
        <Route path="*" element={
          authState.isAuthenticated || authState.isGuest
            ? (onboardingComplete ? (session.pets.length > 0 ? <Dashboard session={session} currentPet={currentPet!} onPetSelect={(id) => setSession(s => ({ ...s, currentPetId: id }))} onAddPet={() => navigate('/onboarding')} onUpdateHistory={handleUpdateHistory} onDeleteLog={handleDeleteLog} onUpdateLog={handleUpdateLog} onUpdateSession={setSession} onNavigate={(path) => navigate(path)} /> : <LandingPage onGetStarted={() => navigate('/login')} onSignIn={() => navigate('/login')} />) : <AppOnboarding onComplete={handleOnboardingComplete} />)
            : <LandingPage onGetStarted={() => navigate('/login')} onSignIn={() => navigate('/login')} />
        } />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
