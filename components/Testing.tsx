import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse, Part } from "@google/genai";
import type { View, Persona, Report } from '../types';

interface TestingProps {
  personas: Persona[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  setActiveView: (view: View) => void;
}

type Message = {
    type: 'user' | 'ai' | 'status';
    content: any;
    prompt?: string;
    image?: { name: string; data: string; };
    link?: string;
    personas?: Persona[];
}

const PersonaSelector: React.FC<{
    personas: Persona[],
    selectedPersonaIds: string[],
    onToggle: (id: string) => void
}> = ({ personas, selectedPersonaIds, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);
    
    return (
        <div className="relative" ref={wrapperRef}>
            <button onClick={() => setIsOpen(o => !o)} type="button" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors text-text-secondary hover:bg-background h-10 px-4 py-2">
                <UsersIcon className="mr-2"/>
                Select Personas ({selectedPersonaIds.length})
            </button>
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-80 bg-surface border border-border rounded-lg shadow-lg z-10 p-2">
                    <p className="text-xs text-text-secondary px-2 pb-1">Select personas for testing</p>
                    <div className="max-h-60 overflow-y-auto">
                        {personas.map(p => (
                            <label key={p.id} className="flex items-center p-2 rounded-md hover:bg-background cursor-pointer">
                                <input type="checkbox" className="h-4 w-4 rounded bg-surface border-border text-brand-primary focus:ring-brand-primary" checked={selectedPersonaIds.includes(p.id)} onChange={() => onToggle(p.id)} />
                                <img src={p.avatarUrl} alt={p.name} className="w-8 h-8 rounded-full mx-3"/>
                                <div>
                                    <p className="font-semibold text-sm text-text-primary">{p.name}</p>
                                    <p className="text-xs text-text-secondary">{p.segment}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

const Testing: React.FC<TestingProps> = ({ personas, setReports, setActiveView }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<{name: string, data: string, mimeType: string} | null>(null);
  const [addedLink, setAddedLink] = useState<string | null>(null);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingMessage]);

  const handlePersonaToggle = (id: string) => {
    setSelectedPersonaIds(prev =>
        prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleImageUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          name: file.name,
          data: e.target?.result as string,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = () => {
    const url = window.prompt("Enter the URL for your prototype (e.g., Figma, InVision):");
    if(url) setAddedLink(url);
  }

  const handleStartTest = async () => {
      if (!prompt.trim() || selectedPersonaIds.length === 0) return;

      setIsLoading(true);
      setError(null);

      const selectedPersonas = personas.filter(p => selectedPersonaIds.includes(p.id));
      
      // Add user message to chat
      setMessages(prev => [...prev, {
          type: 'user',
          content: prompt,
          image: uploadedImage ? { name: uploadedImage.name, data: uploadedImage.data } : undefined,
          link: addedLink || undefined,
          personas: selectedPersonas,
      }]);

      const personaProfiles = selectedPersonas.map(p => 
        `Persona Name: ${p.name}\nSegment: ${p.segment}\nGoals: ${p.goals.join(', ')}\nFrustrations: ${p.frustrations.join(', ')}\n---`
      ).join('\n');
      
      // Reset inputs for next message
      setPrompt('');
      setUploadedImage(null);
      setAddedLink(null);
      setSelectedPersonaIds([]);

      // Dynamic loading messages
      const loadingSteps = [
          'Initializing simulation...',
          `Analyzing the task for ${selectedPersonas[0].name}...`,
          'Simulating user flow and interactions...',
          'Identifying potential friction points...',
          'Synthesizing feedback and insights...',
          'Generating final report...',
      ];

      let step = 0;
      const interval = setInterval(() => {
          setLoadingMessage(loadingSteps[step]);
          step = (step + 1) % loadingSteps.length;
      }, 2000);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `You are a senior UX researcher. Your task is to simulate a user testing session based on the provided prototype description/image/link and user personas. Generate an insightful, actionable report.`;
        
        const textPrompt = `
        Prototype, Link & Task:
        ${prompt}
        ${addedLink ? `\nLink: ${addedLink}` : ''}

        Testing Participants (Personas):
        ${personaProfiles}

        Based on the prototype/task and the personas' goals and frustrations, simulate a user testing session. Generate a report that includes a summary of the overall findings and a list of specific, actionable insights.
        - The summary should capture the general sentiment and key takeaways.
        - The insights should highlight specific issues or successes and suggest improvements.
        `;
        
        const parts: Part[] = [{ text: textPrompt }];
        if (uploadedImage) {
            parts.push({
                inlineData: {
                    mimeType: uploadedImage.mimeType,
                    data: uploadedImage.data.split(',')[1] // remove base64 prefix
                }
            })
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
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
            prototypeId: `proto_${Date.now()}`,
            prototypeName: prompt.substring(0, 50) + '...',
            personaIds: selectedPersonaIds,
            summary: result.summary,
            insights: result.insights,
            dateGenerated: new Date().toISOString().split('T')[0],
        };

        setReports(prev => [newReport, ...prev]);
        setMessages(prev => [...prev, { type: 'ai', content: newReport }]);

      } catch (e) {
          console.error(e);
          setError('Failed to generate report. Please check your API key and try again.');
      } finally {
          clearInterval(interval);
          setLoadingMessage('');
          setIsLoading(false);
      }
  };
  
  const ChatBubble = ({ message }: { message: Message }) => {
    if (message.type === 'user') {
      return (
        <div className="flex justify-end mb-4">
          <div className="bg-brand-primary text-white rounded-lg p-4 max-w-2xl">
            <p>{message.content}</p>
            {message.image && <img src={message.image.data} alt="prototype" className="mt-3 rounded-lg max-h-60" />}
            {message.link && <p className="mt-2 text-sm text-blue-200">Link: <a href={message.link} target="_blank" rel="noopener noreferrer" className="underline">{message.link}</a></p>}
            {message.personas && <div className="mt-3 pt-2 border-t border-blue-300/50 flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold">Tested with:</span>
              {message.personas.map(p => <span key={p.id} className="text-xs bg-white/20 px-2 py-1 rounded-full">{p.name}</span>)}
            </div>}
          </div>
        </div>
      );
    }

    if (message.type === 'ai') {
      const report = message.content as Report;
      return (
        <div className="flex justify-start mb-4">
          <div className="bg-surface rounded-lg p-4 max-w-2xl border border-border">
            <h4 className="text-lg font-bold text-text-primary">Report for: {report.prototypeName}</h4>
             <div className="mt-4 pt-4 border-t border-border">
                <h5 className="font-semibold text-text-primary mb-2">Summary</h5>
                <p className="text-sm text-text-secondary">{report.summary}</p>
            </div>
             <div className="mt-4">
                <h5 className="font-semibold text-text-primary mb-2">Key Insights</h5>
                <ul className="list-disc list-inside text-text-secondary space-y-2 text-sm">
                    {report.insights.map((insight, i) => <li key={i}><strong>{insight.title}:</strong> {insight.detail}</li>)}
                </ul>
            </div>
          </div>
        </div>
      )
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
            {messages.length === 0 && !isLoading && (
                <div className="flex flex-col h-full items-center justify-center text-center">
                    <div className="w-20 h-20 mx-auto bg-surface rounded-full flex items-center justify-center border-2 border-border">
                        <BeakerIcon />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">Usability Testing Simulation</h2>
                    <p className="mt-2 text-md text-text-secondary">Describe your prototype, upload an image, add a Figma link, or write a task below. Then, select the personas and run the simulation to generate a UX report.</p>
                </div>
            )}
            
            {messages.map((msg, i) => <ChatBubble key={i} message={msg} />)}
            
            {isLoading && (
                <div className="flex justify-start mb-4">
                    <div className="bg-surface rounded-lg p-4 max-w-2xl border border-border flex items-center space-x-3">
                        <svg className="animate-spin h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-text-secondary">{loadingMessage}</span>
                    </div>
                </div>
            )}

            <div ref={chatEndRef} />
        </div>
        
        {error && <p className="text-red-500 text-sm mb-2 bg-red-500/10 p-3 rounded-lg">{error}</p>}

        <div className="bg-surface border border-border rounded-xl p-2.5 mt-4">
            <div className="p-2">
                {uploadedImage && <div className="flex items-center space-x-2 bg-background p-2 rounded-lg mb-2">
                    <img src={uploadedImage.data} alt="preview" className="w-10 h-10 rounded-md object-cover" />
                    <span className="text-sm text-text-secondary flex-grow">{uploadedImage.name}</span>
                    <button onClick={() => setUploadedImage(null)} className="p-1 hover:bg-border rounded-full">&times;</button>
                </div>}
                 {addedLink && <div className="flex items-center space-x-2 bg-background p-2 rounded-lg mb-2">
                    <LinkIcon />
                    <span className="text-sm text-text-secondary flex-grow truncate">{addedLink}</span>
                    <button onClick={() => setAddedLink(null)} className="p-1 hover:bg-border rounded-full">&times;</button>
                </div>}
                <textarea
                  rows={2}
                  className="w-full bg-transparent text-text-primary placeholder-text-secondary focus:outline-none resize-none"
                  placeholder="Describe the prototype or task... e.g., 'Test the new user onboarding flow.'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleStartTest(); }}}
                />
            </div>
            <div className="flex justify-between items-center mt-2 border-t border-border pt-2">
                <div className="flex items-center gap-1">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <ActionButton icon={<PaperClipIcon />} tooltip="Upload Image" onClick={handleImageUploadClick} />
                    <ActionButton icon={<LinkIcon />} tooltip="Add Link" onClick={handleAddLink} />
                </div>
                <div className="flex items-center gap-2">
                    <PersonaSelector personas={personas} selectedPersonaIds={selectedPersonaIds} onToggle={handlePersonaToggle}/>
                    <button 
                        onClick={handleStartTest}
                        disabled={prompt.trim().length === 0 || selectedPersonaIds.length === 0 || isLoading}
                        className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-colors"
                    >
                         Start Test
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};


const ActionButton: React.FC<{icon: React.ReactNode, tooltip: string, onClick?: () => void}> = ({icon, tooltip, onClick}) => (
    <button onClick={onClick} className="p-2 text-text-secondary hover:bg-background rounded-md" aria-label={tooltip}>
        {icon}
    </button>
);

// Icons
const BeakerIcon: React.FC = () => <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a2 2 0 002-2v-1a2 2 0 00-2-2H5a2 2 0 00-2 2v1a2 2 0 002 2z"></path></svg>;
const PaperClipIcon: React.FC = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>;
const LinkIcon: React.FC = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>;
const UsersIcon: React.FC<{className?: string}> = ({className=""}) => <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;

export default Testing;