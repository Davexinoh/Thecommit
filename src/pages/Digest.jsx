import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

export default function Digest() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getDailyDigest()
      .then((data) => setArticles(data.articles || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="digest-page">
      <div className="digest-page__header">
        <p className="digest-page__eyebrow">⚡ Daily Briefing</p>
        <h1>Today in Building</h1>
        <p className="digest-page__sub">{today} · AI-reported · Powered by Gemini 2.5</p>
      </div>

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p>Loading briefing…</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box">
          <h3>Couldn't load digest</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && articles.length === 0 && !error && (
        <div className="state-box">
          <h3>No digest yet today</h3>
          <p>Articles are generated every 6 hours. Check back soon.</p>
          <Link to="/feed" className="btn btn--ghost btn--sm" style={{ marginTop: 16, display: 'inline-flex' }}>
            ← Back to feed
          </Link>
        </div>
      )}

      {articles.map((article) => (
        <div key={article.id} className="digest-item">
          <h2 className="digest-item__headline">
            <Link to={`/article/${article.id}`}>{article.headline}</Link>
          </h2>

          {article.subheadline && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              color: 'var(--ink-muted)',
              fontStyle: 'italic',
              marginBottom: 14,
              lineHeight: 1.5,
            }}>
              {article.subheadline}
            </p>
          )}

          {article.digest_bullets && article.digest_bullets.length > 0 ? (
            <ul className="digest-item__bullets">
              {article.digest_bullets.map((bullet, i) => (
                <li key={i} className="digest-item__bullet">{bullet}</li>
              ))}
            </ul>
          ) : (
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--ink-faint)' }}>
              Digest not available for this article.
            </p>
          )}

          <Link
            to={`/article/${article.id}`}
            style={{
              display: 'inline-block',
              marginTop: 14,
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--blue)',
              letterSpacing: '0.02em',
            }}
          >
            Read full story →
          </Link>
        </div>
      ))}

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link to="/feed" className="btn btn--ghost btn--sm">← Back to all stories</Link>
      </div>
    </div>
  );
}
