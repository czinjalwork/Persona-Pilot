import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Persona, View } from '../types';

const initialResearchData = [
  { id: 'rd1', name: 'Q3 Investor Interviews', type: 'Audio Recording', format: 'MP3', dateUploaded: '2024-07-15', status: 'New', summary: 'Conducted 5 interviews with potential property investors in the Noida region to understand their needs regarding high ROI and property management.' },
  { id: 'rd2', name: 'Buyer Feedback Survey Q3', type: 'CSV File', format: 'CSV', dateUploaded: '2024-07-12', status: 'Processed', summary: 'A survey of 250 prospective home buyers. Key themes: frustration with outdated listings and slow agent response times.' },
  { id: 'rd3', name: 'Usability Test Session - Rohan', type: 'Interview Transcript', format: 'DOCX', dateUploaded: '2024-07-10', status: 'New', summary: 'Full transcript of a usability session with a first-time home buyer persona. User was overwhelmed by industry jargon and complex forms.' },
  { id: 'rd4', name: 'Market Analysis - Noida Extension', type: 'PDF Report', format: 'PDF', dateUploaded: '2024-07-05', status: 'Processed', summary: 'Competitor analysis and market trends for the Noida Extension residential real estate market.' },
];

interface ResearchProps {
  setPersonas: React.Dispatch<React.SetStateAction<Persona[]>>;
  setActiveView: (view: View) => void;
}

const UploadDatasetModal: React.FC<{
    onClose: () => void;
    onAddDataset: (dataset: typeof initialResearchData[0]) => void;
}> = ({ onClose, onAddDataset }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('PDF Report');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim()) return;

        const newDataset = {
            id: `rd_${Date.now()}`,
            name,
            type,
            format: type.split(' ')[0].toUpperCase(),
            dateUploaded: new Date().toISOString().split('T')[0],
            status: 'New' as 'New' | 'Processed',
            summary: 'Newly uploaded dataset, summary pending generation.',
        };
        onAddDataset(newDataset);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-surface rounded-lg shadow-xl p-6 border border-border w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-text-primary">Upload New Dataset</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-background" aria-label="Close modal">
                        <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="dataset-name" className="block text-sm font-medium text-text-secondary mb-1">Dataset Name</label>
                            <input type="text" id="dataset-name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border border-border rounded-lg p-2 focus:ring-2 focus:ring-brand-primary" required placeholder="e.g., Q4 Buyer Feedback"/>
                        </div>
                        <div>
                            <label htmlFor="dataset-type" className="block text-sm font-medium text-text-secondary mb-1">Dataset Type</label>
                            <select id="dataset-type" value={type} onChange={e => setType(e.target.value)} className="w-full bg-background border border-border rounded-lg p-2 focus:ring-2 focus:ring-brand-primary">
                                <option>PDF Report</option>
                                <option>CSV File</option>
                                <option>Audio Recording</option>
                                <option>Interview Transcript</option>
                            </select>
                        </div>
                         <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mt-2">
                             <svg className="mx-auto h-10 w-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                             <p className="mt-2 text-sm text-text-secondary">Drag & drop your file here, or <button type="button" className="font-semibold text-brand-primary hover:underline">browse</button>.</p>
                             <p className="text-xs text-text-secondary mt-1">PDF, CSV, MP3, DOCX up to 25MB</p>
                         </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-surface hover:bg-background border border-border text-text-primary transition-colors">Cancel</button>
                        <button type="submit" className="py-2 px-4 rounded-lg bg-brand-primary text-white hover:opacity-90 transition-opacity">Add Dataset</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Research: React.FC<ResearchProps> = ({ setPersonas, setActiveView }) => {
  const [researchData, setResearchData] = useState(initialResearchData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const handleUpdatePersonas = async () => {
    setIsUpdating(true);
    setError(null);
    
    const allSummaries = researchData.map(d => `- ${d.summary}`).join('\n');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are an expert user experience researcher. Create detailed user personas based on the provided research data summary. The personas should be realistic and actionable for a product team building a real estate application. Ensure names are Indian and locations are in or around Noida, India. Generate a unique, random string for each persona ID. Generate a random avatar URL from i.pravatar.cc for each persona. The output must be a valid JSON array of persona objects.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the following research summaries, generate 3-4 diverse user personas for a real estate product:\n\n---\n\n${allSummaries}`,
        config: {
          responseMimeType: "application/json",
          systemInstruction,
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "A unique identifier for the persona (e.g., a random string)." },
                name: { type: Type.STRING, description: "An authentic Indian name." },
                avatarUrl: { type: Type.STRING, description: "A placeholder avatar URL from i.pravatar.cc." },
                segment: { type: Type.STRING, enum: ['Buyer', 'Investor', 'Seller', 'Broker'] },
                goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                frustrations: { type: Type.ARRAY, items: { type: Type.STRING } },
                behaviors: { type: Type.ARRAY, items: { type: Type.STRING } },
                demographics: {
                  type: Type.OBJECT,
                  properties: {
                    age: { type: Type.INTEGER },
                    occupation: { type: Type.STRING },
                    location: { type: Type.STRING, description: "A location in or around Noida, India." },
                  },
                  required: ['age', 'occupation', 'location']
                },
              },
              required: ['id', 'name', 'avatarUrl', 'segment', 'goals', 'frustrations', 'behaviors', 'demographics']
            },
          },
        },
      });

      const jsonString = response.text.trim();
      const newPersonas = JSON.parse(jsonString);
      
      setPersonas(newPersonas);
      setActiveView('personas');

    } catch (e) {
      console.error(e);
      setError('Failed to update personas. Please check your API key and try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleAddDataset = (dataset: typeof initialResearchData[0]) => {
      setResearchData(prev => [dataset, ...prev]);
  };

  const UploadIcon: React.FC<{className?: string}> = ({className=""}) => (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
  );

  return (
    <div className="space-y-6">
      {isUploadModalOpen && <UploadDatasetModal onClose={() => setIsUploadModalOpen(false)} onAddDataset={handleAddDataset} />}
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-2xl font-bold text-text-primary">Research Repository</h3>
           <p className="text-text-secondary mt-1">Manage and analyze your user research datasets.</p>
        </div>
        <div className="flex items-center space-x-4">
            <button 
                onClick={handleUpdatePersonas}
                disabled={isUpdating}
                className="bg-surface text-text-primary border border-border py-2 px-4 rounded-lg hover:bg-background transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Updating...
                </>
              ) : 'Update Personas' }
            </button>
            <button onClick={() => setIsUploadModalOpen(true)} className="bg-brand-primary text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center">
                <UploadIcon className="mr-2" />
                Upload Dataset
            </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded-lg">{error}</p>}

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Dataset Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date Uploaded</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {researchData.map(data => (
                    <tr key={data.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-text-primary">{data.name}</div>
                            <div className="text-xs text-text-secondary">{data.format}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{data.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{data.dateUploaded}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${data.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                {data.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Research;