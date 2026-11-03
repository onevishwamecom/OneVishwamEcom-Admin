import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import App from './App';
import './index.css';

// Auto-recover from chunk hash mismatches when a new deployment goes live
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const reloadKey = 'admin_chunk_reload_lock';
  const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
  if (Date.now() - lastReload > 5000) {
    sessionStorage.setItem(reloadKey, String(Date.now()));
    window.location.reload();
  }
});

window.addEventListener('error', (event) => {
  const msg = event?.message || '';
  if (
    /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(
      msg
    )
  ) {
    const reloadKey = 'admin_chunk_reload_lock';
    const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
    if (Date.now() - lastReload > 5000) {
      sessionStorage.setItem(reloadKey, String(Date.now()));
      window.location.reload();
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
