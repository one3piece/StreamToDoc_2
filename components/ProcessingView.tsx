import React, { useEffect, useRef } from 'react';
import { Loader2, Terminal } from 'lucide-react';
import { AppStatus } from '../types';

interface ProcessingViewProps {
  status: AppStatus;
  progress: number;
  logs: string[];
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ status, progress, logs }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getStatusText = () => {
    switch (status) {
      case AppStatus.DOWNLOADING: return 'Downloading Audio Track...';
      case AppStatus.TRANSCRIBING: return 'Running Whisper ASR...';
      case AppStatus.SUMMARIZING: return 'Gemini is Thinking...';
      default: return 'Processing...';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-2xl">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">{getStatusText()}</h3>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Terminal Logs */}
      <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm h-48 overflow-y-auto border border-slate-800 shadow-inner">
        <div className="flex items-center text-slate-500 mb-2 border-b border-slate-800 pb-2">
          <Terminal className="w-3 h-3 mr-2" />
          <span>System Output</span>
        </div>
        <div className="space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="text-green-400/80">
              <span className="text-slate-600 mr-2 opacity-50">&gt;</span>
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ProcessingView;