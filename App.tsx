import React, { useState } from 'react';
import type { View, Persona, ResearchData, Report, Prototype } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Research from './components/Research';
import Personas from './components/Personas';
import Testing from './components/Testing';
import Reports from './components/Reports';
import { mockPersonas, mockResearch, mockReports, mockPrototypes } from './mockData';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [personas, setPersonas] = useState<Persona[]>(mockPersonas);
  const [research, setResearch] = useState<ResearchData[]>(mockResearch);
  const [prototypes, setPrototypes] = useState<Prototype[]>(mockPrototypes);
  const [reports, setReports] = useState<Report[]>(mockReports);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
          personaCount={personas.length} 
          researchCount={research.length} 
          prototypeCount={prototypes.length}
          reportCount={reports.length}
        />;
      case 'research':
        return <Research setPersonas={setPersonas} setActiveView={setActiveView} />;
      case 'personas':
        return <Personas personas={personas} setActiveView={setActiveView} />;
      case 'testing':
        return <Testing 
          personas={personas}
          setReports={setReports}
          setActiveView={setActiveView}
        />;
      case 'reports':
        return <Reports reports={reports} setActiveView={setActiveView} />;
      default:
        return <Dashboard 
          personaCount={personas.length} 
          researchCount={research.length}
          prototypeCount={prototypes.length}
          reportCount={reports.length}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={activeView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;