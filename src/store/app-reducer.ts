
import { AppState, Action } from '@/types/app-state';

export const appReducer = (state: AppState, action: Action): AppState => {
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
    case 'STATEMENT_PENDING':
      return {
        ...state,
        learningStatements: [action.payload, ...state.learningStatements]
      };
    case 'STATEMENT_SUCCESS':
      return {
        ...state,
        learningStatements: state.learningStatements.map(stmt =>
          stmt.id === action.payload.id ? { ...stmt } : stmt
        )
      };
    case 'STATEMENT_FAILED':
      return {
        ...state,
        learningStatements: state.learningStatements.filter(
          stmt => stmt.id !== action.payload.id
        )
      };
    default:
      return state;
  }
};
