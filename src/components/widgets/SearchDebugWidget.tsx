import { useApp } from '@/contexts/AppContext';

export const SearchDebugWidget = () => {
  const { state } = useApp();

  return (
    <div className="search-widget-container widget-ext">
      <div className="-header">
        <h2 className="-title">Potential Resources</h2>
      </div>
      <div className="widget-result-list">
        {state.searchQueries.map((query) => (
          <div key={query.link} className="search-match">
            <a target="_new" href={query.link} className="search-link">{query.title}</a>
            <div className="search-url">{query.link}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
