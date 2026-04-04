import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import AskBar from '../components/AskBar.jsx';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// Render article body — split on double newlines into paragraphs
function ArticleBody({ body }) {
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  return (
    <div className="article-body">
      {paragraphs.map((p, i) => (
        <p key={i}>{p.trim()}</p>
      ))}
    </div>
  );
}

function DigestAside({ article }) {
  const [bullets, setBullets] = useState(article.digest_bullets || []);
  const [loading, setLoading] = useState(false);

  async function loadDigest() {
    if (bullets.length > 0) return;
    setLoading(true);
    try {
      const data = await api.getDigest(article.id);
      setBullets(data.bullets || []);
    } catch {
      // Fail silently — ask still works
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDigest();
  }, [article.id]);

  return (
    <div className="aside-panel">
      <div className="aside-panel__header">⚡ 60-Second Digest</div>
      <div className="aside-panel__body">
        {loading && <div className="spinner" style={{ margin: '8px auto' }} />}
        {!loading && bullets.length === 0 && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--ink-faint)' }}>
            Digest unavailable.
          </p>
        )}
        {bullets.map((b, i) => (
          <div key={i} className="digest-panel-bullet">
            <span className="digest-panel-bullet__marker">—</span>
            <span>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getArticle(id)
      .then(setArticle)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="state-box" style={{ padding: '80px 24px' }}>
      <div className="spinner" />
      <p>Loading article…</p>
    </div>
  );

  if (error || !article) return (
    <div className="state-box" style={{ padding: '80px 24px' }}>
      <h3>Article not found</h3>
      <p>{error || 'This article may have been removed.'}</p>
      <Link to="/feed" className="btn btn--ghost btn--sm" style={{ marginTop: 16, display: 'inline-flex' }}>
        ← Back to feed
      </Link>
    </div>
  );

  return (
    <div className="article-page">
      {/* Main content */}
      <main>
        <Link to="/feed" className="article-back">← All stories</Link>

        <div className="article-eyebrow">
          <span className="article-cat">{article.category}</span>
          <span className="article-readtime">{article.read_time_minutes} min read</span>
        </div>

        <h1 className="article-headline">{article.headline}</h1>

        {article.subheadline && (
          <p className="article-subheadline">{article.subheadline}</p>
        )}

        <div className="article-byline">
          <div>
            <div className="article-byline__label">Reported by</div>
            <div className="article-byline__name">The Commit AI · Llama 3.3 70B</div>
          </div>
          <div className="article-byline__date">{formatDate(article.fetched_at)}</div>
        </div>

        <ArticleBody body={article.body} />

        {article.sources && article.sources.length > 0 && (
          <div style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: '1px solid var(--paper-rule)',
          }}>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--ink-faint)',
              marginBottom: 12,
            }}>
              Sources
            </p>
            {article.sources.map((s, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.78rem',
                    color: 'var(--blue)',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  {s.title || s.url}
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Aside */}
      <aside className="article-aside">
        <DigestAside article={article} />
        <AskBar articleId={article.id} />
      </aside>
    </div>
  );
}
