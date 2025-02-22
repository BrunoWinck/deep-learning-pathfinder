import { useApp } from '@/contexts/AppContext';

export const SearchDebugWidget = () => {
  const { state } = useApp();

  return (
    <div className="h-[100px] overflow-auto bg-background p-2 text-xs font-mono">
      <h2 className="text-lg font-semibold mb-4">Search Debug</h2>
      <div className="flex-1 overflow-auto space-y-2">
        {state.searchQueries.map((query) => (
          <div key={query.id} className="p-2 bg-background rounded border">
            <div className="font-medium">Query:</div>
            <div className="text-sm mb-2">{query.query}</div>
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
