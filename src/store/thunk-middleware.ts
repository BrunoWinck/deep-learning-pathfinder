
import { AppState, Action, AppAction } from '@/types/app-state';
import { Dispatch } from 'react';
import { toast } from 'sonner';

export const createThunkMiddleware = (state: AppState, dispatch: Dispatch<Action>) => {
  return async (action: AppAction) => {
    if (action.type === 'FETCH_STATEMENTS') {
      try {
        const { endpoint, credentials } = state.xAPIConfig;
        const headers = new Headers({
          'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
          'X-Experience-API-Version': '1.0.0'
        });
        
        toast.promise(
          fetch(`${endpoint}/statements?limit=255`, { headers })
            .then(async response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(response => {
              console.log('Raw LRS Response:', response);
              
              if (!response.statements || !Array.isArray(response.statements)) {
                throw new Error('Invalid response format from xAPI server');
              }
              
              const transformedStatements = response.statements.map((stmt: any) => ({
                id: stmt.id,
                timestamp: new Date(stmt.timestamp).getTime(),
                verb: stmt.verb.display['en-US'].toLowerCase(),
                object: stmt.object.definition?.name['en-US'] || stmt.object.id,
                comment: stmt.result?.response || '',
                grade: stmt.result?.score?.scaled ? Math.round(stmt.result.score.scaled * 10) : 5
              }));

              console.log('Transformed Statements:', transformedStatements);

              dispatch({ type: 'HYDRATE_STATEMENTS', payload: transformedStatements });
              return transformedStatements.length;
            }),
          {
            loading: 'Fetching learning statements...',
            success: (count) => `${count} Learning statements loaded successfully`,
            error: (err) => `Failed to load statements: ${err.message}`,
            duration: 30000
          }
        );
      } catch (error) {
        console.error('Failed to fetch xAPI statements:', error);
        toast.error('Failed to connect to xAPI server', {
          duration: 30000
        });
      }
    } else if (action.type === 'CREATE_STATEMENT') {
      const statementId = crypto.randomUUID();
      
      dispatch({
        type: 'STATEMENT_PENDING',
        payload: {
          id: statementId,
          timestamp: Date.now(),
          verb: action.payload.verb.display["en-US"].toLowerCase() as any,
          object: action.payload.object.definition.name["en-US"],
          comment: action.payload.result?.response || '',
          grade: action.payload.result?.score?.scaled ? Math.round(action.payload.result.score.scaled * 10) : 5
        }
      });

      try {
        const { endpoint, credentials } = state.xAPIConfig;
        const headers = new Headers({
          'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
          'X-Experience-API-Version': '1.0.0',
          'Content-Type': 'application/json'
        });

        const statement = {
          actor: {
            objectType: "Agent",
            name: "Learner",
            account: {
              homePage: "https://lrs.veracity.it",
              name: statementId
            }
          },
          verb: action.payload.verb,
          object: action.payload.object,
          result: action.payload.result
        };

        console.log('Sending statement:', statement);

        const response = await fetch(
          `${endpoint}/statements?statementId=${statementId}`,
          {
            method: 'PUT',
            headers,
            body: JSON.stringify(statement)
          }
        );

        const responseData = await response.json().catch(() => null);
        console.log('Statement creation response:', responseData);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        dispatch({ type: 'STATEMENT_SUCCESS', payload: { id: statementId } });
        toast.success('Learning statement created successfully', {
          duration: 30000
        });

      } catch (error) {
        console.error('Failed to create statement:', error);
        dispatch({ type: 'STATEMENT_FAILED', payload: { id: statementId } });
        toast.error('Failed to create learning statement', {
          duration: 30000
        });
      }
    } else {
      dispatch(action as Action);
    }
  };
};
