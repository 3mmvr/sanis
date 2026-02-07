
import React, { useState } from 'react';
import { UserSession, PetProfile, PetType, BowlSize, HEALTH_GOALS } from '../types';
import { ICONS } from '../constants';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    fullName: string;
    id: string;
  } | null;
  isGuest: boolean;
}

interface SettingsViewProps {
  session: UserSession;
  authState: AuthState;
  onBack: () => void;
  onNavigate: (view: string) => void;
  onAddPet: () => void;
  onUpdateSession: (session: UserSession) => void;
  onUpdatePet: (pet: PetProfile) => void;
  onDeletePet: (petId: string) => void;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  session, 
  authState, 
  onBack, 
  onNavigate, 
  onAddPet, 
  onUpdateSession, 
  onUpdatePet, 
  onDeletePet,
  onLogout 
}) => {
  const [editingPet, setEditingPet] = useState<PetProfile | null>(null);
  const [showAdvancedTargets, setShowAdvancedTargets] = useState(false);

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      const emptySession: UserSession = {
        pets: [],
        currentPetId: null,
        history: {},
        waterLogs: {},
        isGuest: true
      };
      onUpdateSession(emptySession);
      onNavigate('landing');
    }
  };

  const handleEditSave = () => {
    if (editingPet) {
      onUpdatePet(editingPet);
      setEditingPet(null);
      setShowAdvancedTargets(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this pet profile? All nutrition history will be lost.")) {
      onDeletePet(id);
      setEditingPet(null);
      setShowAdvancedTargets(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8F8F8] pb-36">
      <header className="px-6 pt-8 pb-5 flex items-center gap-4">
        <button onClick={onBack} className="p-2 text-black bg-white rounded-full shadow-sm border border-black/5 active:scale-90 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-black text-black tracking-tight">Preferences</h1>
      </header>

      <main className="px-6 space-y-6">
        {/* Account Section */}
        {authState.user && !authState.isGuest && (
          <section>
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Account</h3>
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-black/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-black text-black">
                  {authState.user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-black text-base leading-none mb-1">{authState.user.fullName}</p>
                  <p className="text-xs font-bold text-slate-400">{authState.user.email}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {authState.isGuest && (
          <section>
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-[24px] p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-black text-sm mb-1">Guest Mode</p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Your data is stored locally. Create an account to sync across devices.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Pet Management Section */}
        <section>
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Household</h3>
          <div className="space-y-3">
            {session.pets.map(pet => (
              <div key={pet.id} className="bg-white p-4 rounded-[24px] shadow-sm flex items-center justify-between border border-black/5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center text-xl border border-black/5 shadow-inner">
                    {pet.type === PetType.DOG ? '🐶' : '🐱'}
                  </div>
                  <div>
                    <p className="font-black text-black text-sm leading-none mb-1">{pet.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{pet.breed} &bull; {pet.weight}kg</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingPet({ ...pet })}
                  className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-100 transition-all border border-black/5"
                >
                  <ICONS.Settings className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              onClick={onAddPet}
              className="w-full bg-white border border-dashed border-slate-200 p-5 rounded-[24px] text-slate-400 font-black text-xs uppercase tracking-widest hover:border-black/20 hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <ICONS.Plus className="w-3.5 h-3.5" /> Add New Pet
            </button>
          </div>
        </section>

        {/* Preferences Settings */}
        <section>
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Preferences</h3>
          <div className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-black/5">
            {[
              { label: 'Units', value: 'Metric (kg/ml)' },
              { label: 'Notifications', value: 'On' },
              { label: 'Cloud Backup', value: 'Active' },
              { label: 'Vision Quality', value: 'High' }
            ].map((item, i) => (
              <button key={i} className={`w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-50 transition-colors ${i < 3 ? 'border-b border-black/5' : ''}`}>
                <span className="font-black text-black text-[14px]">{item.label}</span>
                <span className="text-slate-400 font-bold text-sm">{item.value}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="pt-4 space-y-3">
          <button 
            onClick={handleClearAll}
            className="w-full bg-white text-red-500 font-black py-5 rounded-[24px] shadow-sm border border-red-50 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]"
          >
            Delete All Data
          </button>

          <button 
            onClick={onLogout}
            className="w-full bg-black text-white font-black py-5 rounded-[24px] shadow-sm active:scale-95 transition-all text-xs uppercase tracking-[0.2em]"
          >
            {authState.isGuest ? 'Exit Guest Mode' : 'Logout'}
          </button>
        </section>
      </main>

      {/* Edit Modal Refinement */}
      {editingPet && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-t-[40px] p-6 max-h-[85vh] overflow-y-auto shadow-2xl no-scrollbar animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-black">Manage Profile</h2>
              <button onClick={() => { setEditingPet(null); setShowAdvancedTargets(false); }} className="p-2 bg-slate-50 rounded-full border border-black/5"><ICONS.X className="w-5 h-5 text-black" /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Name</label>
                <input 
                  type="text"
                  value={editingPet.name}
                  onChange={(e) => setEditingPet({ ...editingPet, name: e.target.value })}
                  className="w-full bg-slate-50 border border-black/5 rounded-[20px] px-4 py-3 font-black text-sm outline-none focus:ring-2 ring-yellow-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Breed</label>
                  <input 
                    type="text"
                    value={editingPet.breed}
                    onChange={(e) => setEditingPet({ ...editingPet, breed: e.target.value })}
                    className="w-full bg-slate-50 border border-black/5 rounded-[20px] px-4 py-3 font-black text-sm outline-none focus:ring-2 ring-yellow-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Weight (kg)</label>
                  <input 
                    type="number"
                    value={editingPet.weight}
                    onChange={(e) => setEditingPet({ ...editingPet, weight: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-black/5 rounded-[20px] px-4 py-3 font-black text-sm outline-none focus:ring-2 ring-yellow-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Age (years)</label>
                  <input 
                    type="number"
                    value={editingPet.age || ''}
                    onChange={(e) => setEditingPet({ ...editingPet, age: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Optional"
                    className="w-full bg-slate-50 border border-black/5 rounded-[20px] px-4 py-3 font-black text-sm outline-none focus:ring-2 ring-yellow-400 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Portion Reference</label>
                <div className="flex gap-2">
                  {[BowlSize.SMALL, BowlSize.MEDIUM, BowlSize.LARGE].map(size => (
                    <button
                      key={size}
                      onClick={() => setEditingPet({ ...editingPet, bowlSize: size })}
                      className={`flex-1 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                        editingPet.bowlSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-slate-100 bg-slate-50 text-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Collapsible Advanced Targets */}
                <div className="mt-3">
                  <button
                    onClick={() => setShowAdvancedTargets(!showAdvancedTargets)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-[16px] transition-all border border-black/5"
                  >
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Custom Daily Targets</span>
                    <svg 
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showAdvancedTargets ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showAdvancedTargets && (
                    <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-[16px] space-y-3 animate-in slide-in-from-top-2 duration-200">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Calorie Goal (cal/day)</label>
                        <input 
                          type="number"
                          value={editingPet.dailyCalorieTarget || ''}
                          onChange={(e) => setEditingPet({ ...editingPet, dailyCalorieTarget: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="Auto-calculated"
                          className="w-full bg-white border border-slate-200 rounded-[12px] px-4 py-2.5 font-black text-sm outline-none focus:ring-2 ring-yellow-400 transition-all placeholder:text-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Water Target (cups/day)</label>
                        <input 
                          type="number"
                          step="0.5"
                          value={editingPet.dailyWaterTarget || ''}
                          onChange={(e) => setEditingPet({ ...editingPet, dailyWaterTarget: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="Auto-calculated"
                          className="w-full bg-white border border-slate-200 rounded-[12px] px-4 py-2.5 font-black text-sm outline-none focus:ring-2 ring-yellow-400 transition-all placeholder:text-slate-300"
                        />
                      </div>
                      <p className="text-[8px] text-slate-400 font-medium leading-relaxed">
                        Leave blank to use automatic calculation based on weight, age, and health goals.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <button 
                  onClick={handleEditSave}
                  className="w-full bg-black text-white py-3.5 rounded-2xl font-black shadow-lg shadow-black/10 active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                  Update Profile
                </button>
                <button 
                  onClick={() => handleDelete(editingPet.id)}
                  className="w-full py-3.5 rounded-2xl font-black text-red-500 text-xs uppercase tracking-widest hover:bg-red-50 transition-colors"
                >
                  Remove Companion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-black/5 pt-4 pb-8 z-40">
        <div className="max-w-md mx-auto px-6 flex justify-between items-center relative">
          <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center gap-1 text-slate-300">
            <ICONS.Home className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button onClick={() => onNavigate('progress')} className="flex flex-col items-center gap-1 text-slate-300">
            <ICONS.Chart className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-widest">Progress</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-black">
            <ICONS.Settings className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-widest">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SettingsView;
