import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';

const BG_MAP = {
  AI: 'tiktok-card__bg--ai',
  Tools: 'tiktok-card__bg--tools',
  Funding: 'tiktok-card__bg--funding',
  SaaS: 'tiktok-card__bg--saas',
  Community: 'tiktok-card__bg--community',
  'Open Source': 'tiktok-card__bg--opensource',
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function ArticleCard({ article, index, isLast, onLastVisible }) {
  const ref = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!isLast || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLastVisible(); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isLast, onLastVisible]);

  const bgClass = BG_MAP[article.category] || 'tiktok-card__bg--ai';
  const hasImage = !!article.cover_image_url;

  return (
    <div className="tiktok-card" ref={ref}>
      {/* Background — photo or gradient */}
      {hasImage ? (
        <>
          <div
            className={`tiktok-card__bg ${bgClass}`}
            style={{ opacity: imgLoaded ? 0 : 1, transition: 'opacity 0.6s' }}
          />
          <img
            src={article.cover_image_url}
            alt=""
            aria-hidden="true"
            onLoad={() => setImgLoaded(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.6s ease',
              zIndex: 1,
              filter: 'brightness(0.6) saturate(0.85)',
            }}
          />
        </>
      ) : (
        <div className={`tiktok-card__bg ${bgClass}`} />
      )}

      <div className="tiktok-card__noise" />
      <div className="tiktok-card__gradient" />
      <div className="tiktok-card__number">{String(index + 1).padStart(2, '0')}</div>

      <div className="tiktok-card__content">
        <div className="tiktok-card__meta">
          <span className="tiktok-card__cat">{article.category}</span>
          <span className="tiktok-card__time">{timeAgo(article.fetched_at)}</span>
          <span className="tiktok-card__read">{article.read_time_minutes} min read</span>
        </div>

        <h2 className="tiktok-card__headline">{article.headline}</h2>

        {article.subheadline && (
          <p className="tiktok-card__sub">{article.subheadline}</p>
        )}

        <div className="tiktok-card__actions">
          <Link to={`/article/${article.id}`} className="tiktok-card__btn tiktok-card__btn--read">
            Read story →
          </Link>
          <Link to="/digest" className="tiktok-card__btn tiktok-card__btn--digest">
            ⚡ Digest
          </Link>
        </div>

        {hasImage && article.cover_image_credit && (
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.58rem',
            color: 'rgba(255,255,255,0.2)',
            marginTop: 10,
            letterSpacing: '0.02em',
          }}>
            Photo by {article.cover_image_credit} · Pexels
          </p>
        )}
      </div>

      {index === 0 && (
        <div className="tiktok-card__scroll-hint">↓ scroll</div>
      )}
    </div>
  );
}

export default function Feed() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || null;

  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pipelineMsg, setPipelineMsg] = useState('');

  useEffect(() => {
    const nav = document.querySelector('.navbar');
    if (nav) nav.classList.add('navbar--dark');
    return () => { if (nav) nav.classList.remove('navbar--dark'); };
  }, []);

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);

    api.getArticles(1, category)
      .then((data) => {
        setArticles(data.articles || []);
        setHasMore((data.page || 1) < (data.total_pages || 1));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    api.getArticles(nextPage, category)
      .then((data) => {
        setArticles((prev) => [...prev, ...(data.articles || [])]);
        setPage(nextPage);
        setHasMore(nextPage < (data.total_pages || 1));
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, page, category]);

  async function handleRefresh() {
    setPipelineMsg('Generating new articles…');
    try {
      await api.triggerPipeline();
      setTimeout(() => setPipelineMsg(''), 6000);
    } catch {
      setPipelineMsg('');
    }
  }

  if (loading) {
    return (
      <div style={{
        height: 'calc(100vh - 56px)',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="spinner" style={{ borderColor: '#333', borderTopColor: '#fff' }} />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div style={{
        height: 'calc(100vh - 56px)',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'rgba(255,255,255,0.5)' }}>
          No stories yet
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)' }}>
          The pipeline runs every 6 hours
        </p>
        <button className="tiktok-card__btn tiktok-card__btn--read" onClick={handleRefresh}>
          Generate now
        </button>
        {pipelineMsg && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
            {pipelineMsg}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="tiktok-feed">
      {articles.map((article, i) => (
        <ArticleCard
          key={article.id}
          article={article}
          index={i}
          isLast={i === articles.length - 1}
          onLastVisible={loadMore}
        />
      ))}

      {loadingMore && (
        <div className="tiktok-feed__loader">
          <div className="spinner" style={{ borderColor: '#222', borderTopColor: '#555' }} />
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <div className="tiktok-feed__end">You're all caught up</div>
      )}
    </div>
  );
}
