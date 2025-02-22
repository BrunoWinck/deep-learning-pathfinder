
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import './LearningStatementsWidget.css';

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
    <div className="learning-statements-container">
      <h2>Learning Statements</h2>
      
      <div className="statements-scroll-area">
        <div className="statements-list">
          {state.learningStatements.map((statement) => (
            <div key={statement.id} className="statement-card">
              <div className="statement-header">
                <span className="statement-verb">{statement.verb}</span>
                <span className="separator">•</span>
                <span>{statement.object}</span>
              </div>
              {statement.comment && (
                <p className="statement-comment">{statement.comment}</p>
              )}
              <div className="statement-footer">
                <div className="statement-timestamp">
                  {formatDistanceToNow(statement.timestamp, { addSuffix: true })}
                </div>
                <div className="statement-grade">
                  <span>Grade:</span>
                  <span>{statement.grade}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="statement-form" role="form" aria-label="Add learning statement">
        <div className="form-group">
          <label id="statement-type-label">Statement type</label>
          <select
            value={form.verb}
            onChange={(e) => setForm(prev => ({ ...prev, verb: e.target.value as any }))}
            role="combobox"
            aria-labelledby="statement-type-label"
          >
            <option value="watched">Watched</option>
            <option value="read">Read</option>
            <option value="quizzed">Quizzed</option>
            <option value="repeated">Repeated</option>
          </select>
        </div>
        
        <div className="form-group">
          <label id="resource-title-label">Resource title</label>
          <input
            type="text"
            value={form.object}
            onChange={(e) => setForm(prev => ({ ...prev, object: e.target.value }))}
            placeholder="Resource title or link"
            aria-labelledby="resource-title-label"
          />
        </div>

        <div className="form-group">
          <label id="statement-content-label">Statement content</label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
            rows={3}
            aria-labelledby="statement-content-label"
          />
        </div>

        <div className="form-group">
          <label id="grade-label">Grade (0-10)</label>
          <input
            type="range"
            min="0"
            max="10"
            value={form.grade}
            onChange={(e) => setForm(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
            aria-labelledby="grade-label"
          />
          <div className="grade-display" aria-live="polite">{form.grade}</div>
        </div>

        <Button onClick={handleSubmit} className="submit-button">
          Add Statement
        </Button>
      </div>
    </div>
  );
};
