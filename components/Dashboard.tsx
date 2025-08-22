import React from 'react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-surface p-6 rounded-lg border border-border flex items-center">
    <div className="p-3 rounded-full bg-brand-primary/10 text-brand-primary">
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

interface DashboardProps {
  personaCount: number;
  researchCount: number;
  prototypeCount: number;
  reportCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ personaCount, researchCount, prototypeCount, reportCount }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-1">Welcome back, Aditi!</h3>
        <p className="text-text-secondary">Here's a summary of your real estate projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Personas" value={String(personaCount)} icon={<UsersIcon />} />
        <StatCard title="Research Datasets" value={String(researchCount)} icon={<DatabaseIcon />} />
        <StatCard title="Prototypes" value={String(prototypeCount)} icon={<BeakerIcon />} />
        <StatCard title="Reports Generated" value={String(reportCount)} icon={<DocumentReportIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-6 rounded-lg border border-border">
          <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
          <ul className="space-y-4">
            <li className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mr-4">
                <UsersIcon className="w-5 h-5" />
              </div>
              <div>
                <p>New persona 'Tech-Savvy Tina' generated.</p>
                <p className="text-sm text-text-secondary">2 hours ago</p>
              </div>
            </li>
            <li className="flex items-center">
               <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mr-4">
                <DocumentReportIcon className="w-5 h-5" />
              </div>
              <div>
                <p>Report for 'Mobile App Onboarding v2' is ready.</p>
                <p className="text-sm text-text-secondary">1 day ago</p>
              </div>
            </li>
             <li className="flex items-center">
               <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-4">
                <DatabaseIcon className="w-5 h-5" />
              </div>
              <div>
                <p>Added new survey data from 'Q2 User Feedback'.</p>
                <p className="text-sm text-text-secondary">3 days ago</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h4 className="text-lg font-semibold mb-4">Persona Segments</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p>Buyers</p>
              <p className="font-semibold">4</p>
            </div>
            <div className="w-full bg-background rounded-full h-2.5">
              <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: '33%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <p>Sellers</p>
              <p className="font-semibold">3</p>
            </div>
            <div className="w-full bg-background rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
            </div>
             <div className="flex justify-between items-center">
              <p>Investors</p>
              <p className="font-semibold">5</p>
            </div>
            <div className="w-full bg-background rounded-full h-2.5">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons
const UsersIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197m-3 5.197a4 4 0 110-5.292"></path></svg>;
const DatabaseIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7a8 8 0 0116 0M12 11a4 4 0 100-8 4 4 0 000 8z"></path></svg>;
const BeakerIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477a2 2 0 00-.547-1.806 2 2 0 00-1.806-.547m-2.828-2.828a2 2 0 010-2.828l4.243-4.243a2 2 0 012.828 0l4.243 4.243a2 2 0 010 2.828l-4.243 4.243a2 2 0 01-2.828 0l-4.243-4.243z"></path></svg>;
const DocumentReportIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;

export default Dashboard;