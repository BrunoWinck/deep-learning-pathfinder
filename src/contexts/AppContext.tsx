import React, { createContext, useContext, useReducer, Dispatch } from 'react';
import { LearningPath } from '@/types/learning';
import { toast } from 'sonner';

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

type Action = 
  | { type: 'SET_LEARNING_PATHS'; payload: LearningPath[] }
  | { type: 'SET_ACTIVE_PATH'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: AppState['chatMessages'][0] }
  | { type: 'ADD_REACTION'; payload: { messageId: string; reaction: '❤️' | '👍' | '👎' | '🙏' } }
  | { type: 'ADD_SEARCH_QUERY'; payload: AppState['searchQueries'][0] }
  | { type: 'ADD_LEARNING_STATEMENT'; payload: AppState['learningStatements'][0] }
  | { type: 'ADD_AI_QUERY'; payload: AppState['aiQueries'][0] }
  | { type: 'SET_ACTIVE_RESOURCE_LINK'; payload: string | null }
  | { type: 'TOGGLE_VOICE'; payload: boolean }
  | { type: 'HYDRATE_STATEMENTS'; payload: AppState['learningStatements'] };

type AsyncAction = { type: 'FETCH_STATEMENTS' };
type AppAction = Action | AsyncAction;

const initialState: AppState = {
  learningPaths: [
    {
      id: "1",
      name: "AI Agent",
      body: "My path to learn to code AI Agent",
      sections: [
        {
          id: "2",
          name: "overview",
          body: "watch a few videos to get an idea of the topic",
          steps: [],
          goals: [],
          resources: [
            {
              title: "Introduction to AI Agents",
              link: "https://www.youtube.com/watch?v=TfqioNAP1W4"
            }
          ]
        }
      ],
      goals: [],
      resources: []
    }
  ],
  activePath: null,
  chatMessages: [],
  searchQueries: [],
  learningStatements: [],
  aiQueries: [],
  voiceEnabled: true,
  activeResourceLink: null,
  xAPIConfig: {
    endpoint: 'https://cloud.scorm.com/lrs/PMOJRBY6QG',
    credentials: {
      username: 'bwmscormcloud@kneaver.com',
      password: 'lO369e1^{g(0'
    }
  }
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
    case 'SET_ACTIVE_RESOURCE_LINK':
      return { ...state, activeResourceLink: action.payload };
    case 'TOGGLE_VOICE':
      return { ...state, voiceEnabled: action.payload };
    case 'HYDRATE_STATEMENTS':
      return { ...state, learningStatements: action.payload };
    default:
      return state;
  }
};

const createThunkMiddleware = (state: AppState, dispatch: Dispatch<Action>) => {
  return async (action: AppAction) => {
    if (action.type === 'FETCH_STATEMENTS') {
      try {
        const { endpoint, credentials } = state.xAPIConfig;
        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(`${credentials.username}:${credentials.password}`));
        
        toast.promise(
          fetch(`${endpoint}/statements?limit=255`, { headers })
            .then(async response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(statements => {
              if (!Array.isArray(statements)) {
                throw new Error('Invalid response format from xAPI server');
              }
              
              console.log('Raw LRS Response:', statements);
              
              const transformedStatements = statements.map((stmt: any) => ({
                id: stmt.id,
                timestamp: new Date(stmt.timestamp).getTime(),
                verb: stmt.verb.display['en-US'].toLowerCase(),
                object: stmt.object.definition?.name['en-US'] || stmt.object.id,
                comment: stmt.result?.response || '',
                grade: stmt.result?.score?.scaled ? Math.round(stmt.result.score.scaled * 10) : 5
              }));

              console.log('Transformed Statements:', transformedStatements);

              dispatch({ type: 'HYDRATE_STATEMENTS', payload: transformedStatements });
            }),
          {
            loading: 'Fetching learning statements...',
            success: 'Learning statements loaded successfully',
            error: (err) => `Failed to load statements: ${err.message}`,
            duration: 30000 // 30 seconds
          }
        );
      } catch (error) {
        console.error('Failed to fetch xAPI statements:', error);
        toast.error('Failed to connect to xAPI server', {
          duration: 30000 // 30 seconds
        });
      }
    } else {
      dispatch(action as Action);
    }
  };
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: (action: AppAction) => void;
} | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, baseDispatch] = useReducer(appReducer, initialState);
  
  const dispatch = (action: AppAction) => {
    const thunkDispatch = createThunkMiddleware(state, baseDispatch);
    thunkDispatch(action);
  };

  React.useEffect(() => {
    dispatch({ type: 'FETCH_STATEMENTS' });
  }, []);

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
