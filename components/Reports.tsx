import React from 'react';
import type { Report, View } from '../types';

interface ReportsProps {
  reports: Report[];
  setActiveView: (view: View) => void;
}

const ReportCard: React.FC<{ report: Report }> = ({ report }) => (
    <div className="bg-surface p-6 rounded-lg border border-border transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs text-text-secondary">{report.dateGenerated}</p>
                <h4 className="text-lg font-bold text-text-primary mt-1">Report for: {report.prototypeName}</h4>
            </div>
            <div className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Completed
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
            <h5 className="font-semibold text-text-primary mb-2">Summary</h5>
            <p className="text-sm text-text-secondary">{report.summary}</p>
        </div>
         <div className="mt-4">
            <h5 className="font-semibold text-text-primary mb-2">Key Insights</h5>
            <ul className="list-disc list-inside text-text-secondary space-y-1 text-sm">
                {report.insights.map((insight, i) => <li key={i}><strong>{insight.title}:</strong> {insight.detail}</li>)}
            </ul>
        </div>
    </div>
)

const Reports: React.FC<ReportsProps> = ({ reports, setActiveView }) => {
   if (reports.length === 0) {
    return (
      <div className="text-center bg-surface p-12 rounded-lg border-2 border-dashed border-border">
        <svg className="mx-auto h-12 w-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 className="mt-2 text-lg font-medium text-text-primary">No reports yet</h3>
        <p className="mt-1 text-sm text-text-secondary">Test a prototype with your personas to generate a report.</p>
        <div className="mt-6">
            <button
                type="button"
                onClick={() => setActiveView('testing')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
                Test a Prototype
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
};

export default Reports;