
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Link2 } from 'lucide-react';
import './LearningStatementsWidget.css';

export const LearningStatementsWidget = () => {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({
    verb: 'watched' as const,
    object: '',
    link: '',
    comment: '',
    grade: 5
  });

  const handleSubmit = () => {
    if (!form.link) return; // Prevent submission without link
    dispatch({
      type: 'ADD_LEARNING_STATEMENT',
      payload: {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        ...form
      }
    });
    setForm({ verb: 'watched', object: '', link: '', comment: '', grade: 5 });
  };

  const handleLinkChange = (link: string) => {
    // Extract title from link if possible (you might want to expand this logic)
    const title = new URL(link).pathname.split('/').pop() || '';
    setForm(prev => ({ ...prev, link, object: title }));
  };

  const copyStatementLink = (id: string) => {
    const link = `https://lrs.com/statements/${id}`;
    handleLinkChange(link);
  };

  return (
    <div className="learning-statements-container">
      <h2>Learning Statements</h2>
      
      <div className="statements-scroll-area">
        <div className="statements-list">
          {state.learningStatements.map((statement) => (
            <div key={statement.id} className="statement-card">
              <div className="statement-header">
                <button
                  className="link-button"
                  onClick={() => copyStatementLink(statement.id)}
                  aria-label="Copy statement link"
                >
                  <Link2 size={16} />
                </button>
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

      <div className="statement-form" role="form" aria-label="Add statement">
        <div className="form-group">
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
          <label id="statement-type-label">Statement type</label>
        </div>
        
        <div className="form-group">
          <input
            type="url"
            value={form.link}
            onChange={(e) => handleLinkChange(e.target.value)}
            placeholder=" "
            aria-labelledby="resource-link-label"
            required
          />
          <label id="resource-link-label">Resource link</label>
        </div>

        <div className="form-group">
          <input
            type="text"
            value={form.object}
            readOnly
            placeholder=" "
            aria-labelledby="resource-title-label"
          />
          <label id="resource-title-label">Resource title</label>
        </div>

        <div className="form-group">
          <textarea
            value={form.comment}
            onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
            rows={2}
            placeholder=" "
            aria-labelledby="statement-content-label"
          />
          <label id="statement-content-label">Statement content</label>
        </div>

        <div className="form-group">
          <div className="flex items-center gap-4">
            <div className="grade-display w-8 text-center" aria-live="polite">
              {form.grade}
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={form.grade}
              onChange={(e) => setForm(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
              aria-labelledby="grade-label"
              className="flex-1"
            />
            <Button 
              onClick={handleSubmit} 
              disabled={!form.link}
            >
              Add
            </Button>
          </div>
          <label id="grade-label">Grade (0-10)</label>
        </div>
      </div>
    </div>
  );
};
