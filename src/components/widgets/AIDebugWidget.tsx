
import { useApp } from '@/contexts/AppContext';

export const AIDebugWidget = () => {
  const { state } = useApp();

  return (
    <div className="widget-ext">
      <div className="-header">
        <h2 className="-title">AI Debug</h2>
      </div>
      <div className="widget-result-list">
        {state.aiQueries.map((query) => (
          <div key={query.id} className="ai-cell">
            <div className="prompt">Prompt:</div>
            <div className="prompt-text">{query.prompt}</div>
            <div className="prompt">Response:</div>
            <div className="ai-response">{query.response}</div>
            <div className="ai-when">
              {new Date(query.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
