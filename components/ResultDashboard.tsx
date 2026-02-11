import React, { useState } from 'react';
import { SummaryResult } from '../types';
import { FileText, List, Clock, GitGraph, Download, RefreshCcw } from 'lucide-react';
import MindMap from './MindMap';

interface ResultDashboardProps {
  result: SummaryResult;
  onReset: () => void;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'bullets' | 'timeline' | 'mindmap'>('summary');

  const handleExport = () => {
    const content = `
# ${result.title}

## Summary
${result.summary}

## Key Points
${result.keyPoints.map(p => `- ${p}`).join('\n')}

## Timeline
${result.timeline.map(t => `- **${t.time}**: ${t.description}`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.md';
    a.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-white">{result.title}</h2>
           <p className="text-slate-400 mt-1">AI Generated Analysis</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            New
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg hover:shadow-blue-500/25"
          >
            <Download className="w-4 h-4 mr-2" />
            Export MD
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 space-x-6 overflow-x-auto">
        {[
          { id: 'summary', label: 'Summary', icon: FileText },
          { id: 'bullets', label: 'Key Points', icon: List },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'mindmap', label: 'Mind Map', icon: GitGraph },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'summary' && (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl leading-relaxed text-slate-200 text-lg">
            {result.summary}
          </div>
        )}

        {activeTab === 'bullets' && (
          <div className="grid gap-4">
            {result.keyPoints.map((point, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-sm flex items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mr-4 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-slate-200">{point}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="relative border-l-2 border-slate-700 ml-3 space-y-8 py-4">
            {result.timeline.map((event, index) => (
              <div key={index} className="ml-8 relative">
                <div className="absolute -left-[41px] bg-slate-900 border-2 border-purple-500 w-6 h-6 rounded-full"></div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <span className="text-purple-400 font-mono text-sm font-bold block mb-1">
                    {event.time}
                  </span>
                  <p className="text-slate-200">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mindmap' && (
           <MindMap data={result.mindMap} />
        )}
      </div>
    </div>
  );
};

export default ResultDashboard;