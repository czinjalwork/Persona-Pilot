import type { Persona, ResearchData, Report, Prototype } from './types';

export const mockPersonas: Persona[] = [
  {
    id: 'p1',
    name: 'Priya Sharma',
    avatarUrl: 'https://i.pravatar.cc/150?u=p1',
    segment: 'Buyer',
    goals: ['Find investment properties quickly', 'Get real-time market data', 'Streamline communication with brokers'],
    frustrations: ['Outdated listings', 'Slow response times from agents', 'Complex paperwork process'],
    behaviors: ['Uses multiple real estate apps', 'Prefers mobile communication', 'Analyzes data before making decisions'],
    demographics: {
      age: 34,
      occupation: 'Software Engineer',
      location: 'Sector 62, Noida',
    },
  },
  {
    id: 'p2',
    name: 'Rohan Verma',
    avatarUrl: 'https://i.pravatar.cc/150?u=p2',
    segment: 'Buyer',
    goals: ['Understand the home buying process', 'Find an affordable starter home', 'Get a good mortgage rate'],
    frustrations: ['Feeling overwhelmed with information', 'Hidden costs and fees', 'Competition from other buyers'],
    behaviors: ['Reads online guides and articles', 'Attends open houses every weekend', 'Relies heavily on his real estate agent'],
    demographics: {
      age: 28,
      occupation: 'Graphic Designer',
      location: 'Greater Noida',
    },
  },
    {
    id: 'p3',
    name: 'Vikram Singh',
    avatarUrl: 'https://i.pravatar.cc/150?u=p3',
    segment: 'Investor',
    goals: ['Achieve a high ROI', 'Diversify his property portfolio', 'Minimize property management hassles'],
    frustrations: ['Inaccurate property valuations', 'Lack of detailed financial data on listings', 'Time-consuming property searches'],
    behaviors: ['Uses spreadsheets for financial modeling', 'Networks with other investors and brokers', 'Focuses on cash flow potential'],
    demographics: {
      age: 45,
      occupation: 'Financial Analyst',
      location: 'Sector 18, Noida',
    },
  },
];

export const mockResearch: ResearchData[] = [
  {
    id: 'r1',
    type: 'survey',
    source: 'Q2 User Feedback Survey',
    notes: 'Users reported difficulty in filtering search results and expressed a desire for more neighborhood information.',
    dateAdded: '2023-10-26',
  },
  {
    id: 'r2',
    type: 'interview',
    source: 'Investor Focus Group',
    notes: 'Investors need more granular data, including cap rates, cash-on-cash return, and detailed expense reports for potential properties.',
    dateAdded: '2023-10-22',
  },
];

export const mockPrototypes: Prototype[] = [
  {
    id: 'proto1',
    name: 'Mobile App Onboarding v2',
    description: 'Figma prototype for the updated mobile app onboarding flow, focusing on simplicity for new users.',
    dateAdded: '2023-10-24',
  },
  {
    id: 'proto2',
    name: 'Investor Dashboard ROI Calculator',
    description: 'Interactive web prototype for a new ROI calculation tool aimed at experienced investors.',
    dateAdded: '2023-10-20',
  }
];

export const mockReports: Report[] = [
  {
    id: 'rep1',
    prototypeId: 'proto1',
    prototypeName: 'Mobile App Onboarding v2',
    personaIds: ['p2'],
    summary: 'First-Time Frank found the new onboarding flow much clearer than the previous version. He appreciated the step-by-step guide but was confused by the term "escrow."',
    insights: [
        { title: 'Clarity Improvement', detail: 'The visual timeline was highly effective for users unfamiliar with the buying process.' },
        { title: 'Jargon Confusion', detail: 'Technical real estate terms should be explained in plain language or linked to a glossary.' }
    ],
    dateGenerated: '2023-10-25',
  },
];