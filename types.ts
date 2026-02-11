export enum AppStatus {
  IDLE = 'IDLE',
  DOWNLOADING = 'DOWNLOADING', // Mocked
  TRANSCRIBING = 'TRANSCRIBING', // Mocked
  SUMMARIZING = 'SUMMARIZING', // Real
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
}

export interface TimelineEvent {
  time: string;
  description: string;
}

export interface SummaryResult {
  title: string;
  summary: string;
  keyPoints: string[];
  timeline: TimelineEvent[];
  mindMap: MindMapNode;
}

export interface ProcessingState {
  status: AppStatus;
  progress: number;
  logs: string[];
  error?: string;
}

export type LLMModel = 'gemini-2.5-flash-preview' | 'gemini-3-flash-preview';