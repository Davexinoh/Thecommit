import { Link } from 'react-router-dom';

export default function Landing() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div>
      {/* Minimal top bar */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--ink)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>
          The <span style={{ color: 'var(--accent)' }}>Commit</span>
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn--ghost btn--sm" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>
            Sign in
          </Link>
          <Link to="/signup" className="btn btn--accent btn--sm">
            Get access
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="landing-hero">
        <div className="hero__eyebrow">AI-Reported News for Builders</div>
        <h1 className="hero__title">
          The news that matters<br />
          to people who <em>ship.</em>
        </h1>
        <p className="hero__sub">
          The Commit tracks what's moving in dev tools, open source, indie SaaS, and founder culture — then writes the story. No editors. No lag. Just signal.
        </p>
        <div className="hero__actions">
          <Link to="/signup" className="btn btn--accent">
            Start reading free
          </Link>
          <Link to="/login" className="btn btn--ghost" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}>
            Sign in
          </Link>
        </div>
        <div className="hero__rule" />
      </div>

      {/* How it works */}
      <div className="landing-section" style={{ background: 'var(--paper)' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <p className="section__label">The Pipeline</p>
          <h2 className="section__title">Real data. Real writing. Zero editorial latency.</h2>
          <p className="section__body">
            Every six hours, The Commit pulls trending topics from across the builder internet, sources real stories, and generates reported articles — with citations, context, and a journalist's instinct for what actually matters.
          </p>

          <div className="pipeline">
            {[
              { label: 'Trends', name: 'Virlo API' },
              { label: 'Sources', name: 'Hacker News' },
              { label: 'Article', name: 'Groq / Llama 3.3' },
              { label: 'Digest', name: 'Gemini 2.5' },
            ].map((step, i, arr) => (
              <div key={step.name} className="pipeline__step">
                <div className="pipeline__node">
                  <div className="pipeline__node-label">{step.label}</div>
                  <div className="pipeline__node-name">{step.name}</div>
                </div>
                {i < arr.length - 1 && <span className="pipeline__arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="landing-section landing-section--alt">
        <div className="container">
          <p className="section__label" style={{ textAlign: 'center' }}>What you get</p>
          <div className="features-grid">
            {[
              {
                icon: '📰',
                title: 'Reported articles',
                body: 'Full 600-word stories written to the standard of a senior tech journalist. Cited, contextualised, never hype.',
              },
              {
                icon: '⚡',
                title: 'Daily digest',
                body: 'Three bullet points per story. Catch up on everything that happened in 60 seconds flat.',
              },
              {
                icon: '💬',
                title: 'Ask the story',
                body: 'Have a question about something you just read? Ask it inline. Gemini answers from the article itself.',
              },
              {
                icon: '📡',
                title: 'Trend-seeded editorial',
                body: 'Topics are sourced from real-time social signals — not editorial hunches or SEO keyword lists.',
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <div className="landing-cta">
        <div className="container--narrow">
          <h2>Built for builders, by a builder.</h2>
          <p>Free to read. No ads. Just the news you actually needed.</p>
          <Link to="/signup" className="btn btn--accent">
            Create your account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <p>© {new Date().getFullYear()} The Commit · AI-reported builder news · {today}</p>
      </div>
    </div>
  );
}
