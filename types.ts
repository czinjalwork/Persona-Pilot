
export type View = 'dashboard' | 'research' | 'personas' | 'reports' | 'testing';

export interface ResearchData {
  id: string;
  type: 'survey' | 'interview' | 'analytics' | 'other';
  source: string;
  notes: string;
  dateAdded: string;
}

export interface Persona {
  id: string;
  name: string;
  avatarUrl: string;
  segment: 'Buyer' | 'Investor' | 'Seller' | 'Broker';
  goals: string[];
  frustrations: string[];
  behaviors: string[];
  demographics: {
    age: number;
    occupation: string;
    location: string;
  };
}

export interface Prototype {
  id: string;
  name: string;
  description: string;
  dateAdded: string;
}

export interface Report {
  id: string;
  prototypeId: string;
  prototypeName: string;
  personaIds: string[];
  summary: string;
  insights: { title: string; detail: string }[];
  dateGenerated: string;
}