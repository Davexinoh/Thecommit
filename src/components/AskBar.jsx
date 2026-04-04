import { useState } from 'react';
import { api } from '../lib/api.js';

export default function AskBar({ articleId }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAsk() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer('');
    setError('');

    try {
      const data = await api.askQuestion(articleId, question.trim());
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAsk();
  }

  return (
    <div className="aside-panel">
      <div className="aside-panel__header">
        💬 Ask about this story
      </div>
      <div className="aside-panel__body">
        <div className="ask-form">
          <textarea
            className="ask-input"
            placeholder="What does this mean for solo founders?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
          />
          <button
            className="btn btn--primary btn--sm"
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            style={{ opacity: loading || !question.trim() ? 0.5 : 1 }}
          >
            {loading ? 'Thinking…' : 'Ask — ⌘↵'}
          </button>
        </div>

        {error && (
          <div className="form-error" style={{ marginTop: 10 }}>{error}</div>
        )}

        {answer && (
          <div className="ask-answer">{answer}</div>
        )}
      </div>
    </div>
  );
}
