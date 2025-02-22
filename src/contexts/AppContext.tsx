
import React, { createContext, useContext, useReducer } from 'react';
import { AppState, AppAction } from '@/types/app-state';
import { initialState } from '@/store/initial-state';
import { appReducer } from '@/store/app-reducer';
import { createThunkMiddleware } from '@/store/thunk-middleware';

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
