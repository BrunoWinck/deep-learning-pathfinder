
import React, { createContext, useContext, useReducer, Dispatch } from 'react';
import { LearningPath } from '@/types/learning';

interface AppState {
  learningPaths: LearningPath[];
  activePath: string | null;
  chatMessages: Array<{
    id: string;
    text: string;
    isAI: boolean;
    reactions: Array<'❤️' | '👍' | '👎' | '🙏'>;
    timestamp: number;
  }>;
  searchQueries: Array<{
    id: string;
    query: string;
    response: string;
    timestamp: number;
  }>;
  learningStatements: Array<{
    id: string;
    timestamp: number;
    verb: 'watched' | 'read' | 'quizzed' | 'repeated';
    object: string;
    comment: string;
    grade: number;
  }>;
  aiQueries: Array<{
    id: string;
    prompt: string;
    response: string;
    timestamp: number;
  }>;
  voiceEnabled: boolean;
}

type Action = 
  | { type: 'SET_LEARNING_PATHS'; payload: LearningPath[] }
  | { type: 'SET_ACTIVE_PATH'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: AppState['chatMessages'][0] }
  | { type: 'ADD_REACTION'; payload: { messageId: string; reaction: '❤️' | '👍' | '👎' | '🙏' } }
  | { type: 'ADD_SEARCH_QUERY'; payload: AppState['searchQueries'][0] }
  | { type: 'ADD_LEARNING_STATEMENT'; payload: AppState['learningStatements'][0] }
  | { type: 'ADD_AI_QUERY'; payload: AppState['aiQueries'][0] }
  | { type: 'TOGGLE_VOICE'; payload: boolean };

const initialState: AppState = {
  learningPaths: [],
  activePath: null,
  chatMessages: [],
  searchQueries: [],
  learningStatements: [
    {
      id: '1',
      timestamp: Date.now() - 86400000, // 1 day ago
      verb: 'watched',
      object: 'Neural Networks Fundamentals Video',
      comment: 'Great introduction to the basics of neural networks',
      grade: 8
    },
    {
      id: '2',
      timestamp: Date.now() - 43200000, // 12 hours ago
      verb: 'read',
      object: 'Deep Learning Book Chapter 1',
      comment: 'Complex but informative material on mathematical foundations',
      grade: 7
    },
    {
      id: '3',
      timestamp: Date.now() - 3600000, // 1 hour ago
      verb: 'quizzed',
      object: 'Machine Learning Basics Quiz',
      comment: 'Scored 85%, need to review gradient descent',
      grade: 6
    }
  ],
  aiQueries: [],
  voiceEnabled: true,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_LEARNING_PATHS':
      return { ...state, learningPaths: action.payload };
    case 'SET_ACTIVE_PATH':
      return { ...state, activePath: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'ADD_REACTION':
      return {
        ...state,
        chatMessages: state.chatMessages.map(msg =>
          msg.id === action.payload.messageId
            ? { ...msg, reactions: [...msg.reactions, action.payload.reaction] }
            : msg
        ),
      };
    case 'ADD_SEARCH_QUERY':
      return { ...state, searchQueries: [...state.searchQueries, action.payload] };
    case 'ADD_LEARNING_STATEMENT':
      return { ...state, learningStatements: [...state.learningStatements, action.payload] };
    case 'ADD_AI_QUERY':
      return { ...state, aiQueries: [...state.aiQueries, action.payload] };
    case 'TOGGLE_VOICE':
      return { ...state, voiceEnabled: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
} | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
