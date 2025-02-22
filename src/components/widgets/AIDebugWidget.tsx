
import { useApp } from '@/contexts/AppContext';

export const AIDebugWidget = () => {
  const { state } = useApp();

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">AI Debug</h2>
      <div className="flex-1 overflow-auto space-y-2">
        {state.aiQueries.map((query) => (
          <div key={query.id} className="p-2 bg-background rounded border">
            <div className="font-medium">Prompt:</div>
            <div className="text-sm mb-2">{query.prompt}</div>
            <div className="font-medium">Response:</div>
            <div className="text-sm">{query.response}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(query.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
