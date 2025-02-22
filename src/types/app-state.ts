
import { LearningPath } from './learning';

export interface AppState {
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
    verb: 'watched' | 'read' | 'quizzed' | 'repeated'| 'realized'| 'remembered';
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
  activeResourceLink: string | null;
  xAPIConfig: {
    endpoint: string;
    credentials: {
      username: string;
      password: string;
    };
  };
}

export type Action = 
  | { type: 'SET_LEARNING_PATHS'; payload: LearningPath[] }
  | { type: 'SET_ACTIVE_PATH'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: AppState['chatMessages'][0] }
  | { type: 'ADD_REACTION'; payload: { messageId: string; reaction: '❤️' | '👍' | '👎' | '🙏' } }
  | { type: 'ADD_SEARCH_QUERY'; payload: AppState['searchQueries'][0] }
  | { type: 'ADD_LEARNING_STATEMENT'; payload: AppState['learningStatements'][0] }
  | { type: 'ADD_AI_QUERY'; payload: AppState['aiQueries'][0] }
  | { type: 'SET_ACTIVE_RESOURCE_LINK'; payload: string | null }
  | { type: 'TOGGLE_VOICE'; payload: boolean }
  | { type: 'HYDRATE_STATEMENTS'; payload: AppState['learningStatements'] }
  | { type: 'STATEMENT_PENDING'; payload: AppState['learningStatements'][0] }
  | { type: 'STATEMENT_SUCCESS'; payload: { id: string } }
  | { type: 'STATEMENT_FAILED'; payload: { id: string } };

export type AsyncAction = 
  | { type: 'FETCH_STATEMENTS' }
  | { 
      type: 'CREATE_STATEMENT'; 
      payload: {
        verb: { id: string; display: { "en-US": string } };
        object: {
          id: string;
          definition: {
            name: { "en-US": string };
            description: { "en-US": string };
          };
          objectType: "Activity";
        };
        result?: {
          response?: string;
          score?: {
            scaled: number;
          };
        };
      }
    };

export type AppAction = Action | AsyncAction;
