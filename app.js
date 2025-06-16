const BASE = '/pwa';

registerSW();

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${BASE}/sw.js`)
    .then(() => {
      updateSWStatus('✅ Service Worker terdaftar');
    })
    .catch(err => {
      updateSWStatus('❌ Gagal daftar SW: ' + err.message);
    });
  } else {
    updateSWStatus('⚠️ Service Worker tidak didukung browser');
  }

  updateOnlineStatus();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

function updateOnlineStatus() {
  const statusEl = document.getElementById('online-status');
  statusEl.textContent = navigator.onLine ? '🌐 Online' : '🚫 Offline';
}

function updateSWStatus(text) {
  const swStatusEl = document.getElementById('sw-status');
  swStatusEl.textContent = text;
}
