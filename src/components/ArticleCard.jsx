import { Link } from 'react-router-dom';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ArticleCard({ article, index }) {
  return (
    <Link to={`/article/${article.id}`} style={{ display: 'block' }}>
      <article className="article-card">
        <div>
          <div className="article-card__meta">
            <span className="article-card__cat">{article.category}</span>
            <span className="article-card__dot" />
            <span className="article-card__time">{timeAgo(article.fetched_at)}</span>
          </div>
          <h2 className="article-card__headline">{article.headline}</h2>
          {article.subheadline && (
            <p className="article-card__sub">{article.subheadline}</p>
          )}
          <p className="article-card__read">{article.read_time_minutes} min read</p>
        </div>
        <div className="article-card__rank">
          {String(index + 1).padStart(2, '0')}
        </div>
      </article>
    </Link>
  );
}
