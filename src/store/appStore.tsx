import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, AppStep, BOMComponent } from '../types';

interface AppContextType {
  state: AppState;
  setStep: (step: AppStep) => void;
  loadProject: (components: BOMComponent[]) => void;
  setProcessing: (processing: boolean) => void;
  setClassificationDone: (done: boolean) => void;
  setMBomGenerated: (done: boolean) => void;
  setRoutingDone: (done: boolean) => void;
  setApproval: (id: string, approved: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentStep: AppStep.DASHBOARD,
    components: [],
    isProjectLoaded: false,
    classificationDone: false,
    mBomGenerated: false,
    routingDone: false,
    isProcessing: false,
    approvals: {}
  });

  const setStep = (step: AppStep) => setState(prev => ({ ...prev, currentStep: step }));
  
  const loadProject = (components: BOMComponent[]) => setState(prev => ({
    ...prev,
    components,
    isProjectLoaded: true
  }));

  const setProcessing = (isProcessing: boolean) => setState(prev => ({ ...prev, isProcessing }));
  const setClassificationDone = (classificationDone: boolean) => setState(prev => ({ ...prev, classificationDone }));
  const setMBomGenerated = (mBomGenerated: boolean) => setState(prev => ({ ...prev, mBomGenerated }));
  const setRoutingDone = (routingDone: boolean) => setState(prev => ({ ...prev, routingDone }));
  
  const setApproval = (id: string, approved: boolean) => setState(prev => ({
    ...prev,
    approvals: { ...prev.approvals, [id]: approved }
  }));

  return (
    <AppContext.Provider value={{
      state,
      setStep,
      loadProject,
      setProcessing,
      setClassificationDone,
      setMBomGenerated,
      setRoutingDone,
      setApproval
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
