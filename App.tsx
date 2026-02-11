import React, { useState, useCallback } from 'react';
import { AppStatus, ProcessingState, SummaryResult } from './types';
import { DEMO_TRANSCRIPT, MOCK_LOGS } from './constants';
import { generateSummary } from './services/geminiService';
import ConfigForm from './components/ConfigForm';
import ProcessingView from './components/ProcessingView';
import ResultDashboard from './components/ResultDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({
    status: AppStatus.IDLE,
    progress: 0,
    logs: [],
  });
  const [result, setResult] = useState<SummaryResult | null>(null);

  const addLog = (msg: string) => {
    setState(prev => ({ ...prev, logs: [...prev.logs, msg] }));
  };

  const handleError = (error: string) => {
    setState(prev => ({ 
      ...prev, 
      status: AppStatus.ERROR, 
      error,
      logs: [...prev.logs, `Error: ${error}`] 
    }));
  };

  const startProcess = useCallback(async (url: string, apiKey: string, conciseness: number, customText?: string) => {
    // 1. Reset State
    setState({
      status: AppStatus.DOWNLOADING,
      progress: 5,
      logs: ["Job started..."],
    });
    setResult(null);

    try {
      let transcriptText = customText;

      // 2. Mock Download & Transcribe if URL is used
      if (!transcriptText) {
        addLog(`Analyzing URL: ${url}`);
        
        // Simulate Downloading
        for (let i = 0; i < 3; i++) {
          await new Promise(r => setTimeout(r, 800));
          setState(prev => ({ 
            ...prev, 
            status: AppStatus.DOWNLOADING,
            progress: 10 + (i * 10) 
          }));
          addLog(MOCK_LOGS[i]);
        }

        // Simulate Transcribing
        setState(prev => ({ ...prev, status: AppStatus.TRANSCRIBING }));
        addLog("Starting Whisper ASR engine...");
        
        for (let i = 3; i < MOCK_LOGS.length; i++) {
          await new Promise(r => setTimeout(r, 400));
          setState(prev => ({ 
            ...prev, 
            progress: 40 + ((i-3) * 5) 
          }));
          addLog(MOCK_LOGS[i]);
        }
        
        // Use demo transcript
        transcriptText = DEMO_TRANSCRIPT;
        addLog("NOTE: Using simulated transcript for this demo.");
      } else {
        addLog("Using provided text input...");
        setState(prev => ({ ...prev, progress: 50 }));
        await new Promise(r => setTimeout(r, 500));
      }

      // 3. Real Gemini Call
      setState(prev => ({ ...prev, status: AppStatus.SUMMARIZING, progress: 80 }));
      addLog("Connecting to Gemini API...");
      addLog("Generating structured intelligence...");
      
      const summary = await generateSummary(apiKey, transcriptText!, conciseness);
      
      setState(prev => ({ ...prev, progress: 100, status: AppStatus.COMPLETED }));
      addLog("Analysis complete.");
      setResult(summary);

    } catch (e: any) {
      handleError(e.message || "An unexpected error occurred");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      {state.status === AppStatus.IDLE && (
        <div className="animate-in fade-in zoom-in duration-500">
           <ConfigForm onStart={startProcess} isLoading={false} />
        </div>
      )}

      {(state.status === AppStatus.DOWNLOADING || 
        state.status === AppStatus.TRANSCRIBING || 
        state.status === AppStatus.SUMMARIZING) && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProcessingView 
            status={state.status} 
            progress={state.progress} 
            logs={state.logs} 
          />
        </div>
      )}

      {state.status === AppStatus.COMPLETED && result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <ResultDashboard result={result} onReset={() => setState(prev => ({ ...prev, status: AppStatus.IDLE }))} />
        </div>
      )}

      {state.status === AppStatus.ERROR && (
        <div className="max-w-md mx-auto mt-20 p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
          <h3 className="text-red-400 text-xl font-bold mb-2">Process Failed</h3>
          <p className="text-red-200 mb-4">{state.error}</p>
          <button 
            onClick={() => setState(prev => ({ ...prev, status: AppStatus.IDLE }))}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;