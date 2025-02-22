
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export const LearningStatementsWidget = () => {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({
    verb: 'watched' as const,
    object: '',
    comment: '',
    grade: 5
  });

  const handleSubmit = () => {
    dispatch({
      type: 'ADD_LEARNING_STATEMENT',
      payload: {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        ...form
      }
    });
    setForm({ verb: 'watched', object: '', comment: '', grade: 5 });
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Learning Statements</h2>
      
      {/* Display existing statements */}
      <div className="flex-1 overflow-auto mb-4">
        <div className="space-y-3">
          {state.learningStatements.map((statement) => (
            <div key={statement.id} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">{statement.verb}</span>
                <span className="text-muted-foreground">•</span>
                <span>{statement.object}</span>
              </div>
              {statement.comment && (
                <p className="text-sm text-muted-foreground mt-1">{statement.comment}</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(statement.timestamp, { addSuffix: true })}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Grade:</span>
                  <span className="text-sm">{statement.grade}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form for adding new statements */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Verb</label>
          <select
            value={form.verb}
            onChange={(e) => setForm(prev => ({ ...prev, verb: e.target.value as any }))}
            className="w-full p-2 rounded border"
          >
            <option value="watched">Watched</option>
            <option value="read">Read</option>
            <option value="quizzed">Quizzed</option>
            <option value="repeated">Repeated</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Object</label>
          <input
            type="text"
            value={form.object}
            onChange={(e) => setForm(prev => ({ ...prev, object: e.target.value }))}
            className="w-full p-2 rounded border"
            placeholder="Resource title or link"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
            className="w-full p-2 rounded border"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Grade (0-10)</label>
          <input
            type="range"
            min="0"
            max="10"
            value={form.grade}
            onChange={(e) => setForm(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="text-center">{form.grade}</div>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Add Statement
        </Button>
      </div>
    </div>
  );
};
