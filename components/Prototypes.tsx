import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { View, Prototype, Persona, Report } from '../types';

interface PrototypesProps {
  prototypes: Prototype[];
  setPrototypes: React.Dispatch<React.SetStateAction<Prototype[]>>;
  personas: Persona[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  setActiveView: (view: View) => void;
}

const TestSimulationModal: React.FC<{
    prototype: Prototype;
    personas: Persona[];
    onClose: () => void;
    onRunSimulation: (selectedPersonaIds: string[]) => Promise<void>;
    isLoading: boolean;
}> = ({ prototype, personas, onClose, onRunSimulation, isLoading }) => {
    const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);

    const handlePersonaToggle = (id: string) => {
        setSelectedPersonaIds(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const handleRun = () => {
        if(selectedPersonaIds.length > 0) {
            onRunSimulation(selectedPersonaIds);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-dark-surface rounded-lg shadow-xl p-8 border border-dark-border w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Start Test for: <span className="text-brand-secondary">{prototype.name}</span></h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-dark-border" aria-label="Close modal">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <p className="text-dark-text-secondary mb-6">Select which personas should participate in this user testing simulation.</p>
                <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3">
                    {personas.map(p => (
                        <label key={p.id} className="flex items-center bg-dark-bg p-4 rounded-lg border border-dark-border has-[:checked]:border-brand-secondary has-[:checked]:bg-brand-primary/10 transition-colors duration-200 cursor-pointer">
                            <input type="checkbox" className="h-5 w-5 rounded bg-dark-surface border-dark-border text-brand-secondary focus:ring-brand-secondary" checked={selectedPersonaIds.includes(p.id)} onChange={() => handlePersonaToggle(p.id)} />
                            <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded-full mx-4"/>
                            <div>
                                <p className="font-semibold">{p.name}</p>
                                <p className="text-sm text-dark-text-secondary">{p.segment}</p>
                            </div>
                        </label>
                    ))}
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="py-2 px-4 rounded-lg bg-dark-border hover:bg-slate-600 transition-colors">Cancel</button>
                    <button 
                        onClick={handleRun}
                        disabled={selectedPersonaIds.length === 0 || isLoading}
                        className="py-2 px-6 flex items-center rounded-lg bg-brand-secondary hover:bg-blue-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
                    >
                         {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Running...
                            </>
                        ) : 'Run Simulation'}
                    </button>
                </div>
            </div>
        </div>
    )
}


const Prototypes: React.FC<PrototypesProps> = ({ prototypes, setPrototypes, personas, setReports, setActiveView }) => {
  const [newPrototypeName, setNewPrototypeName] = useState('');
  const [newPrototypeDesc, setNewPrototypeDesc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrototype, setSelectedPrototype] = useState<Prototype | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPrototype = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrototypeName.trim() || !newPrototypeDesc.trim()) return;

    const newPrototype: Prototype = {
      id: `proto_${Date.now()}`,
      name: newPrototypeName,
      description: newPrototypeDesc,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setPrototypes(prev => [newPrototype, ...prev]);
    setNewPrototypeName('');
    setNewPrototypeDesc('');
  };

  const openTestModal = (prototype: Prototype) => {
    setSelectedPrototype(prototype);
    setIsModalOpen(true);
  };

  const closeTestModal = () => {
    setSelectedPrototype(null);
    setIsModalOpen(false);
    setError(null);
  };
  
  const handleRunSimulation = async (selectedPersonaIds: string[]) => {
      if (!selectedPrototype) return;
      
      setIsLoading(true);
      setError(null);

      const selectedPersonas = personas.filter(p => selectedPersonaIds.includes(p.id));
      const personaProfiles = selectedPersonas.map(p => 
        `Persona Name: ${p.name}\nSegment: ${p.segment}\nGoals: ${p.goals.join(', ')}\nFrustrations: ${p.frustrations.join(', ')}\n---`
      ).join('\n');

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `You are a senior UX researcher tasked with analyzing feedback on a new product prototype. Your analysis should be insightful, actionable, and directly tied to the user personas provided. Generate a concise report based on a simulated user testing session.`;

        const prompt = `
        Prototype to Test:
        Name: ${selectedPrototype.name}
        Description: ${selectedPrototype.description}

        Testing Participants (Personas):
        ${personaProfiles}

        Based on the prototype and the personas' goals and frustrations, simulate a user testing session. Generate a report that includes a summary of the overall findings and a list of specific, actionable insights.
        - The summary should capture the general sentiment and key takeaways.
        - The insights should highlight specific issues or successes and suggest improvements.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                systemInstruction,
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A concise summary of the overall user testing findings." },
                        insights: {
                            type: Type.ARRAY,
                            description: "A list of specific, actionable insights from the testing session.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING, description: "A short, descriptive title for the insight." },
                                    detail: { type: Type.STRING, description: "A detailed explanation of the insight and its impact." }
                                },
                                required: ['title', 'detail']
                            }
                        }
                    },
                    required: ['summary', 'insights']
                },
            }
        });

        const result = JSON.parse(response.text.trim());
        const newReport: Report = {
            id: `rep_${Date.now()}`,
            prototypeId: selectedPrototype.id,
            prototypeName: selectedPrototype.name,
            personaIds: selectedPersonaIds,
            summary: result.summary,
            insights: result.insights,
            dateGenerated: new Date().toISOString().split('T')[0],
        };

        setReports(prev => [newReport, ...prev]);
        closeTestModal();
        setActiveView('reports');

      } catch (e) {
          console.error(e);
          setError('Failed to generate report. Please try again.');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {isModalOpen && selectedPrototype && (
        <TestSimulationModal 
            prototype={selectedPrototype}
            personas={personas}
            onClose={closeTestModal}
            onRunSimulation={handleRunSimulation}
            isLoading={isLoading}
        />
      )}
      <div className="lg:col-span-1">
        <div className="bg-dark-surface p-6 rounded-lg border border-dark-border">
          <h3 className="text-xl font-bold mb-4">Add New Prototype</h3>
          <form onSubmit={handleAddPrototype} className="space-y-4">
            <div>
              <label htmlFor="prototype-name" className="block text-sm font-medium text-dark-text-secondary mb-1">Prototype Name</label>
              <input type="text" id="prototype-name" value={newPrototypeName} onChange={e => setNewPrototypeName(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg p-2 focus:ring-2 focus:ring-brand-secondary" required />
            </div>
            <div>
              <label htmlFor="prototype-desc" className="block text-sm font-medium text-dark-text-secondary mb-1">Link or Description</label>
              <textarea id="prototype-desc" rows={4} value={newPrototypeDesc} onChange={e => setNewPrototypeDesc(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg p-2 focus:ring-2 focus:ring-brand-secondary" required />
            </div>
            <button type="submit" className="w-full bg-brand-secondary text-white py-2 rounded-lg hover:bg-blue-500 transition-colors">Add Prototype</button>
          </form>
        </div>
      </div>
      <div className="lg:col-span-2">
        <h3 className="text-xl font-bold mb-4">Existing Prototypes</h3>
        <div className="space-y-4">
          {prototypes.length === 0 ? (
             <p className="text-dark-text-secondary text-center py-8">No prototypes added yet.</p>
          ) : (
            prototypes.map(proto => (
              <div key={proto.id} className="bg-dark-surface p-4 rounded-lg border border-dark-border flex justify-between items-center">
                <div>
                  <p className="font-bold text-dark-text-primary">{proto.name}</p>
                  <p className="text-sm text-dark-text-secondary">{proto.description}</p>
                </div>
                <button onClick={() => openTestModal(proto)} className="bg-brand-primary text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors whitespace-nowrap">
                  Start User Test
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Prototypes;
