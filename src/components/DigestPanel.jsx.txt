import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function DigestPanel() {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDailyDigest()
      .then(setDigest)
      .catch(() => setDigest(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="sidebar-widget">
      <div className="sidebar-widget__header">⚡ Today's Digest</div>
      <div className="sidebar-widget__body">
        {loading && <div className="spinner" style={{ margin: '12px auto' }} />}

        {!loading && !digest && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--ink-faint)' }}>
            No digest available yet.
          </p>
        )}

        {!loading && digest?.articles?.map((article) => (
          <div key={article.id} style={{ marginBottom: 16 }}>
            <Link
              to={`/article/${article.id}`}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--ink)',
                display: 'block',
                marginBottom: 6,
                lineHeight: 1.4,
              }}
            >
              {article.headline}
            </Link>
            {article.digest_bullets?.slice(0, 1).map((bullet, i) => (
              <div key={i} className="digest-bullet">{bullet}</div>
            ))}
          </div>
        ))}

        <Link
          to="/digest"
          style={{
            display: 'block',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--accent)',
            marginTop: 12,
            letterSpacing: '0.04em',
          }}
        >
          Full briefing →
        </Link>
      </div>
    </div>
  );
}
