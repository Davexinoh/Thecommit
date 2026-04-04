const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('tc_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({ error: 'Invalid response from server' }));

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  signup: (email, password) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: () =>
    request('/auth/logout', { method: 'POST' }),

  // Articles
  getArticles: (page = 1, category = null) => {
    const params = new URLSearchParams({ page, limit: 10 });
    if (category) params.set('category', category);
    return request(`/articles?${params}`);
  },

  getArticle: (id) => request(`/articles/${id}`),

  triggerPipeline: () => request('/articles/pipeline/run', { method: 'POST' }),

  // Digest
  getDigest: (articleId) => request(`/digest/${articleId}`),
  getDailyDigest: () => request('/digest'),

  // Ask
  askQuestion: (articleId, question) =>
    request(`/ask/${articleId}`, { method: 'POST', body: JSON.stringify({ question }) }),
};
