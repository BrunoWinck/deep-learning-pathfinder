import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Link2 } from 'lucide-react';
import './LearningStatementsWidget.css';

// xAPI Verb types based on ADL's standard verbs
const STANDARD_VERBS = {
  abandoned: "http://adlnet.gov/expapi/verbs/abandoned",
  answered: "http://adlnet.gov/expapi/verbs/answered",
  asked: "http://adlnet.gov/expapi/verbs/asked",
  attempted: "http://adlnet.gov/expapi/verbs/attempted",
  attended: "http://adlnet.gov/expapi/verbs/attended",
  commented: "http://adlnet.gov/expapi/verbs/commented",
  completed: "http://adlnet.gov/expapi/verbs/completed",
  exited: "http://adlnet.gov/expapi/verbs/exited",
  experienced: "http://adlnet.gov/expapi/verbs/experienced",
  failed: "http://adlnet.gov/expapi/verbs/failed",
  imported: "http://adlnet.gov/expapi/verbs/imported",
  initialized: "http://adlnet.gov/expapi/verbs/initialized",
  launched: "http://adlnet.gov/expapi/verbs/launched",
  mastered: "http://adlnet.gov/expapi/verbs/mastered",
  passed: "http://adlnet.gov/expapi/verbs/passed",
  preferred: "http://adlnet.gov/expapi/verbs/preferred",
  progressed: "http://adlnet.gov/expapi/verbs/progressed",
  registered: "http://adlnet.gov/expapi/verbs/registered",
  responded: "http://adlnet.gov/expapi/verbs/responded",
  resumed: "http://adlnet.gov/expapi/verbs/resumed",
  scored: "http://adlnet.gov/expapi/verbs/scored",
  shared: "http://adlnet.gov/expapi/verbs/shared",
  suspended: "http://adlnet.gov/expapi/verbs/suspended",
  terminated: "http://adlnet.gov/expapi/verbs/terminated",
  voided: "http://adlnet.gov/expapi/verbs/voided",
  // Custom Kneaver verbs
  watched: "https://www.kneaver.com/xapi/verbs/watched",
  read: "https://www.kneaver.com/xapi/verbs/read",
  quizzed: "https://www.kneaver.com/xapi/verbs/quizzed",
  repeated: "https://www.kneaver.com/xapi/verbs/repeated",
  realized: "https://www.kneaver.com/xapi/verbs/realized",
  remembered: "https://www.kneaver.com/xapi/verbs/remembered",
};

type AllowedVerb = 'watched' | 'read' | 'quizzed' | 'repeated' | 'realized' | 'remembered';

const mapToAllowedVerb = (verb: string): AllowedVerb => {
  const normalized = verb.toLowerCase();
  if (isAllowedVerb(normalized)) {
    return normalized;
  }
  return 'watched'; // Default fallback
};

const isAllowedVerb = (verb: string): verb is AllowedVerb => {
  return ['watched', 'read', 'quizzed', 'repeated', 'realized', 'remembered'].includes(verb);
};

export const LearningStatementsWidget = () => {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({
    verb: {
      id: STANDARD_VERBS.watched,
      display: { "en-US": "watched" }
    },
    object: {
      id: "",
      definition: {
        name: { "en-US": "" },
        description: { "en-US": "" }
      },
      objectType: "Activity" as const
    },
    result: {
      response: "",
      score: {
        scaled: 0.5
      }
    }
  });

  useEffect(() => {
    if (state.activeResourceLink) {
      handleLinkChange(state.activeResourceLink);
    }
  }, [state.activeResourceLink]);

  const handleSubmit = () => {
    if (!form.object.id) return;
    
    const statement = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      verb: form.verb,
      object: form.object,
      result: form.result
    };

    dispatch({
      type: 'ADD_LEARNING_STATEMENT',
      payload: {
        id: statement.id,
        timestamp: Date.now(),
        verb: mapToAllowedVerb(form.verb.display["en-US"]),
        object: form.object.definition.name["en-US"],
        comment: form.result.response,
        grade: Math.round(form.result.score.scaled * 10)
      }
    });

    setForm({
      verb: { id: STANDARD_VERBS.watched, display: { "en-US": "watched" } },
      object: {
        id: "",
        definition: { name: { "en-US": "" }, description: { "en-US": "" } },
        objectType: "Activity"
      },
      result: {
        response: "",
        score: { scaled: 0.5 }
      }
    });
  };

  const handleLinkChange = (link: string) => {
    const title = new URL(link).pathname.split('/').pop() || '';
    setForm(prev => ({
      ...prev,
      object: {
        id: link,
        definition: {
          name: { "en-US": title },
          description: { "en-US": "" }
        },
        objectType: "Activity"
      }
    }));
  };

  const copyStatementLink = (id: string) => {
    const link = `${state.xAPIConfig.endpoint}/statements/${id}`;
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
                  <span>Score:</span>
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
            value={form.verb.id}
            onChange={(e) => {
              const verbId = e.target.value;
              const verbDisplay = e.target.options[e.target.selectedIndex].text;
              setForm(prev => ({
                ...prev,
                verb: {
                  id: verbId,
                  display: { "en-US": verbDisplay }
                }
              }));
            }}
            role="combobox"
            aria-labelledby="statement-type-label"
          >
            {Object.entries(STANDARD_VERBS).map(([display, id]) => (
              <option key={id} value={id}>
                {display}
              </option>
            ))}
          </select>
          <label id="statement-type-label">Statement type</label>
        </div>
        
        <div className="form-group">
          <input
            type="url"
            value={form.object.id}
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
            value={form.object.definition.name["en-US"]}
            onChange={(e) => setForm(prev => ({
              ...prev,
              object: {
                ...prev.object,
                definition: {
                  ...prev.object.definition,
                  name: { "en-US": e.target.value }
                }
              }
            }))}
            placeholder=" "
            aria-labelledby="resource-title-label"
          />
          <label id="resource-title-label">Resource title</label>
        </div>

        <div className="form-group">
          <textarea
            value={form.result.response}
            onChange={(e) => setForm(prev => ({
              ...prev,
              result: {
                ...prev.result,
                response: e.target.value
              }
            }))}
            rows={2}
            placeholder=" "
            aria-labelledby="statement-content-label"
          />
          <label id="statement-content-label">Statement content</label>
        </div>

        <div className="form-group">
          <div className="flex items-center gap-4">
            <div className="grade-display w-8 text-center" aria-live="polite">
              {Math.round(form.result.score.scaled * 10)}
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={Math.round(form.result.score.scaled * 10)}
              onChange={(e) => setForm(prev => ({
                ...prev,
                result: {
                  ...prev.result,
                  score: {
                    scaled: parseInt(e.target.value) / 10
                  }
                }
              }))}
              aria-labelledby="grade-label"
              className="flex-1"
            />
            <Button 
              onClick={handleSubmit} 
              disabled={!form.object.id}
            >
              Add
            </Button>
          </div>
          <label id="grade-label">Score (0-10)</label>
        </div>
      </div>
    </div>
  );
};
