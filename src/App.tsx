import React, { useState } from 'react';
import { StepId, ComponentItem, ActivityItem, ToastMessage } from './types';
import { SAMPLE_COMPONENTS } from './data/sampleData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProgressStepper } from './components/ProgressStepper';
import { ToastContainer } from './components/ToastContainer';

import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { CADViewerPage } from './pages/CADViewerPage';
import { ClassificationPage } from './pages/ClassificationPage';
import { MBOMPage } from './pages/MBOMPage';
import { RoutingPage } from './pages/RoutingPage';
import { LineBalancingPage } from './pages/LineBalancingPage';
import { ConstraintsPage } from './pages/ConstraintsPage';
import { QualityPage } from './pages/QualityPage';
import { VariantPage } from './pages/VariantPage';
import { ERPSyncPage } from './pages/ERPSyncPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { ExportPage } from './pages/ExportPage';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepId>(StepId.DASHBOARD);
  const [components, setComponents] = useState<ComponentItem[]>(SAMPLE_COMPONENTS);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(
    new Set(['upload', 'cad', 'classify', 'mbom', 'routing'])
  );

  // Initial audit activity log entries
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'act-0',
      timestamp: '09:00:12',
      stepName: 'System Init',
      summary: 'Project EMA-2024 Electric Motor Assembly loaded in workspace.',
      type: 'info',
    },
    {
      id: 'act-1',
      timestamp: '09:02:45',
      stepName: 'Upload eBOM',
      summary: 'Parsed SOLIDWORKS assembly EMA-2024.SLDASM — 25 components extracted.',
      type: 'success',
    },
    {
      id: 'act-2',
      timestamp: '09:05:10',
      stepName: 'CAD Viewer',
      summary: 'Loaded 3D WebGL assembly simulation and hierarchy tree.',
      type: 'info',
    },
  ]);

  const handleLoadDemoProject = () => {
    setComponents(SAMPLE_COMPONENTS);
    setCompletedSteps(
      new Set([
        'upload',
        'cad',
        'classify',
        'mbom',
        'routing',
        'balance',
        'constraints',
        'quality',
        'variants',
        'sync',
        'approve',
      ])
    );
    addToast('Demo Project Loaded', 'Electric Motor Assembly (EMA-2024) initialized.', 'success');
    addActivity('Demo Loaded', 'Loaded baseline dataset across all manufacturing stages.', 'info');
  };

  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivity = (
    stepName: string,
    summary: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: timeStr,
      stepName,
      summary,
      type,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const renderActivePage = () => {
    switch (currentStep) {
      case StepId.DASHBOARD:
        return (
          <DashboardPage
            components={components}
            onSelectStep={(step) => setCurrentStep(step)}
            onLoadDemoProject={handleLoadDemoProject}
            activities={activities}
            completedSteps={completedSteps}
            addToast={addToast}
          />
        );

      case StepId.UPLOAD:
        return (
          <UploadPage
            onCompleteUpload={(comps) => {
              setComponents(comps);
              setCompletedSteps((prev) => new Set([...prev, 'upload', 'cad']));
            }}
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.CAD:
        return <CADViewerPage components={components} />;

      case StepId.CLASSIFY:
        return (
          <ClassificationPage
            components={components}
            onUpdateComponents={(updated) => setComponents(updated)}
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.MBOM:
        return (
          <MBOMPage
            components={components}
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.ROUTING:
        return (
          <RoutingPage
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.BALANCE:
        return (
          <LineBalancingPage
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
          />
        );

      case StepId.CONSTRAINTS:
        return (
          <ConstraintsPage
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.QUALITY:
        return (
          <QualityPage
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.VARIANTS:
        return (
          <VariantPage
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.ERP:
        return (
          <ERPSyncPage
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.ANALYTICS:
        return <AnalyticsPage />;

      case StepId.AUDIT:
        return <AuditLogPage activities={activities} />;

      case StepId.EXPORT:
      case 'export' as StepId:
        return (
          <ExportPage
            components={components}
            onSelectStep={(step) => setCurrentStep(step)}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.INSIGHTS:
      case 'insights' as StepId:
        return <AnalyticsPage />;

      case StepId.SYNC:
      case 'sync' as StepId:
      case StepId.APPROVE:
      case 'approve' as StepId:
        return (
          <ERPSyncPage
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      case StepId.VERSIONS:
      case 'versions' as StepId:
        return (
          <VariantPage
            onSelectStep={(step) => setCurrentStep(step)}
            setIsProcessing={setIsProcessing}
            setProcessingMessage={setProcessingMessage}
            addToast={addToast}
            addActivity={addActivity}
          />
        );

      default:
        return (
          <DashboardPage
            components={components}
            onSelectStep={(step) => setCurrentStep(step)}
            onLoadDemoProject={handleLoadDemoProject}
            activities={activities}
            completedSteps={completedSteps}
            addToast={addToast}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden ml-64">
        {/* Top Header */}
        <Header
          currentStep={currentStep}
          isProcessing={isProcessing}
          processingMessage={processingMessage}
        />

        {/* Process Stepper */}
        <ProgressStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onSelectStep={(step) => setCurrentStep(step)}
        />

        {/* Main Viewport Container */}
        <main
          className={`flex-1 p-6 max-w-[1600px] w-full mx-auto ${
            currentStep === 'dashboard' ? 'pt-20' : 'pt-36'
          }`}
        >
          {renderActivePage()}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
