import React, { useState } from 'react';
import { Settings, Key, Link as LinkIcon, FileText } from 'lucide-react';

interface ConfigFormProps {
  onStart: (url: string, apiKey: string, conciseness: number, customTranscript?: string) => void;
  isLoading: boolean;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ onStart, isLoading }) => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [conciseness, setConciseness] = useState(50);
  const [mode, setMode] = useState<'url' | 'text'>('url');
  const [customText, setCustomText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      alert("Please enter your Gemini API Key");
      return;
    }
    if (mode === 'url' && !url) {
      alert("Please enter a Video URL");
      return;
    }
    if (mode === 'text' && !customText) {
      alert("Please paste the transcript text");
      return;
    }
    
    onStart(url, apiKey, conciseness, mode === 'text' ? customText : undefined);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800 rounded-xl border border-slate-700 shadow-2xl p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
          NoteFlow AI
        </h2>
        <p className="text-slate-400">
          Transform video content into actionable wisdom using your own AI key.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Key Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-300">
            <Key className="w-4 h-4 mr-2 text-yellow-400" />
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <p className="text-xs text-slate-500">
            Key is only stored in browser memory and sent directly to Google.
          </p>
        </div>

        {/* Input Mode Switch */}
        <div className="flex space-x-4 border-b border-slate-700 pb-2">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center pb-2 text-sm font-medium transition-colors ${
              mode === 'url' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Video URL
          </button>
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`flex items-center pb-2 text-sm font-medium transition-colors ${
              mode === 'text' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Paste Text
          </button>
        </div>

        {/* Content Input */}
        {mode === 'url' ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Video URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
             <p className="text-xs text-amber-500/80">
                Note: In this web demo, real downloading is simulated. We will use a sample transcript for the AI analysis unless you choose "Paste Text".
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Transcript Text
            </label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste your transcript here..."
              rows={6}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm"
            />
          </div>
        )}

        {/* Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <Settings className="w-4 h-4 mr-2 text-purple-400" />
              Conciseness
            </label>
            <span className="text-sm text-blue-400 font-mono">{conciseness}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={conciseness}
            onChange={(e) => setConciseness(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>Detailed</span>
            <span>Balanced</span>
            <span>Brief</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all transform hover:scale-[1.01] ${
            isLoading
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25'
          }`}
        >
          {isLoading ? 'Processing...' : 'Analyze Video'}
        </button>
      </form>
    </div>
  );
};

export default ConfigForm;