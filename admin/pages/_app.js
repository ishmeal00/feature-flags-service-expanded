import '../styles/output.css'
import Layout from '../components/Layout'

import axios from 'axios';
// fetch csrf token on load and set axios defaults for mutating requests
if (typeof window !== 'undefined') {
  (async function() {
    try {
      const res = await fetch('/api/csrf-token', { credentials: 'include' });
      const data = await res.json();
      if (data.csrfToken) {
        axios.defaults.headers.common['x-csrf-token'] = data.csrfToken;
      }
      axios.defaults.withCredentials = true;
    } catch (e) { console.warn('csrf token fetch failed', e); }
  })();
}

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
