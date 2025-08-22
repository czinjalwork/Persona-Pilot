import React from 'react';
import type { Persona, View } from '../types';

interface PersonasProps {
  personas: Persona[];
  setActiveView: (view: View) => void;
}

const PersonaCard: React.FC<{ persona: Persona }> = ({ persona }) => (
    <div className="bg-surface p-6 rounded-lg border border-border flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center mb-4">
            <img src={persona.avatarUrl} alt={persona.name} className="w-16 h-16 rounded-full mr-4 border-2 border-brand-primary" />
            <div>
                <h4 className="text-xl font-bold text-text-primary">{persona.name}</h4>
                <p className="text-sm font-semibold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full inline-block">{persona.segment}</p>
            </div>
        </div>
        <div className="text-sm text-text-secondary mb-4">
            {persona.demographics.age}, {persona.demographics.occupation} from {persona.demographics.location}
        </div>
        <div className="space-y-4 flex-grow">
            <div>
                <h5 className="font-semibold text-text-primary mb-1">Goals</h5>
                <ul className="list-disc list-inside text-text-secondary space-y-1 text-sm">
                    {persona.goals.map((goal, i) => <li key={i}>{goal}</li>)}
                </ul>
            </div>
            <div>
                <h5 className="font-semibold text-text-primary mb-1">Frustrations</h5>
                <ul className="list-disc list-inside text-text-secondary space-y-1 text-sm">
                    {persona.frustrations.map((frustration, i) => <li key={i}>{frustration}</li>)}
                </ul>
            </div>
        </div>
    </div>
);


const Personas: React.FC<PersonasProps> = ({ personas, setActiveView }) => {
  if (personas.length === 0) {
    return (
      <div className="text-center bg-surface p-12 rounded-lg border-2 border-dashed border-border">
        <svg className="mx-auto h-12 w-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197m-3 5.197a4 4 0 110-5.292" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-text-primary">No personas yet</h3>
        <p className="mt-1 text-sm text-text-secondary">Get started by generating personas from your research data.</p>
        <div className="mt-6">
            <button
                type="button"
                onClick={() => setActiveView('research')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Generate Personas
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {personas.map((persona) => (
        <PersonaCard key={persona.id} persona={persona} />
      ))}
    </div>
  );
};

export default Personas;