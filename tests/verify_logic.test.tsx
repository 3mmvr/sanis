import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LandingPage from '../components/LandingPage';
import Dashboard from '../components/Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { PetType, BowlSize } from '../types';

describe('LandingPage Logic', () => {
  const mockOnGetStarted = vi.fn();
  const mockOnSignIn = vi.fn();

  it('redirects to dashboard when authenticated on Start Trial click', () => {
    const authState = { isAuthenticated: true, isGuest: false };
    render(
      <BrowserRouter>
        <LandingPage 
          authState={authState} 
          onGetStarted={mockOnGetStarted} 
          onSignIn={mockOnSignIn} 
        />
      </BrowserRouter>
    );
    
    const startTrialBtn = screen.getByText(/Start Trial/i);
    fireEvent.click(startTrialBtn);
    // Since we use navigate('/dashboard') inside, we verify it doesn't call onGetStarted
    expect(mockOnGetStarted).not.toHaveBeenCalled();
  });

  it('calls onGetStarted when NOT authenticated', () => {
    const authState = { isAuthenticated: false, isGuest: false };
    render(
      <BrowserRouter>
        <LandingPage 
          authState={authState} 
          onGetStarted={mockOnGetStarted} 
          onSignIn={mockOnSignIn} 
        />
      </BrowserRouter>
    );
    
    const startTrialBtn = screen.getByText(/Start Trial/i);
    fireEvent.click(startTrialBtn);
    expect(mockOnGetStarted).toHaveBeenCalled();
  });
});

describe('Dashboard Alarm Logic', () => {
  const mockSession = {
    pets: [],
    currentPetId: null,
    history: {},
    waterLogs: {},
    isGuest: true
  };

  const mockPet = {
    id: '1',
    name: 'Test',
    type: PetType.DOG,
    breed: 'Labrador',
    weight: 20,
    age: 5,
    bowlSize: BowlSize.MEDIUM,
    healthGoals: []
  };

  it('shows No Pet Profile alarm when pets array is empty', () => {
    render(
      <BrowserRouter>
        <Dashboard 
          session={mockSession}
          currentPet={mockPet}
          onPetSelect={() => {}}
          onAddPet={() => {}}
          onUpdateHistory={() => {}}
          onDeleteLog={() => {}}
          onUpdateLog={() => {}}
          onUpdateSession={() => {}}
          onNavigate={() => {}}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/No Pet Profile Found/i)).toBeInTheDocument();
  });

  it('hides alarm when pets are present', () => {
    const sessionWithPet = { ...mockSession, pets: [mockPet] };
    render(
      <BrowserRouter>
        <Dashboard 
          session={sessionWithPet}
          currentPet={mockPet}
          onPetSelect={() => {}}
          onAddPet={() => {}}
          onUpdateHistory={() => {}}
          onDeleteLog={() => {}}
          onUpdateLog={() => {}}
          onUpdateSession={() => {}}
          onNavigate={() => {}}
        />
      </BrowserRouter>
    );
    
    expect(screen.queryByText(/No Pet Profile Found/i)).not.toBeInTheDocument();
  });
});
