import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import ArticleCard from '../components/ArticleCard.jsx';
import DigestPanel from '../components/DigestPanel.jsx';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

export default function Feed() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || null;

  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pipelineMsg, setPipelineMsg] = useState('');

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    setLoading(true);
    setError('');
    api.getArticles(page, category)
      .then((data) => {
        setArticles(data.articles || []);
        setTotalPages(data.total_pages || 1);
        setTotal(data.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, category]);

  async function handleRefresh() {
    setPipelineMsg('Generating new articles… check back in ~60 seconds.');
    try {
      await api.triggerPipeline();
    } catch (err) {
      setPipelineMsg(`Error: ${err.message}`);
    }
    setTimeout(() => setPipelineMsg(''), 8000);
  }

  return (
    <div className="feed-layout">
      {/* Main column */}
      <main>
        <div className="feed-header">
          <h1>{category ? `${category} News` : 'Latest Stories'}</h1>
          <p className="feed-header__date">{today} · {total} articles</p>
        </div>

        {pipelineMsg && (
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.78rem',
            color: 'var(--success)',
            background: '#f0faf4',
            border: '1px solid #b6e8cc',
            borderRadius: 'var(--radius)',
            padding: '10px 14px',
            marginBottom: 20,
          }}>
            {pipelineMsg}
          </div>
        )}

        {loading && (
          <div className="state-box">
            <div className="spinner" />
            <p>Loading stories…</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-box">
            <h3>Couldn't load articles</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="state-box">
            <h3>No articles yet</h3>
            <p>The pipeline runs every 6 hours.</p>
            <button
              className="btn btn--primary btn--sm"
              style={{ margin: '16px auto 0', display: 'flex' }}
              onClick={handleRefresh}
            >
              Generate now
            </button>
          </div>
        )}

        {!loading && articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} index={(page - 1) * 10 + i} />
        ))}

        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ opacity: page === 1 ? 0.4 : 1 }}
            >
              ← Prev
            </button>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ opacity: page === totalPages ? 0.4 : 1 }}
            >
              Next →
            </button>
            <span className="pagination__info">Page {page} of {totalPages}</span>
          </div>
        )}
      </main>

      {/* Sidebar */}
      <aside className="feed-sidebar">
        <DigestPanel />

        <div className="sidebar-widget">
          <div className="sidebar-widget__header">About The Commit</div>
          <div className="sidebar-widget__body">
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 12 }}>
              Builder news reported by AI. Topics sourced from real-time social signals via Virlo, stories from Hacker News, articles written by Llama 3.3 70B, digests by Gemini 2.5.
            </p>
            <button
              className="btn btn--ghost btn--sm"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleRefresh}
            >
              ↻ Refresh pipeline
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
