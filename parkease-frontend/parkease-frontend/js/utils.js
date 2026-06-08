// ============================================
// ParkEase — Utility Functions
// ============================================

// Show toast notification
function showToast(message, type = 'info') {
  const colors = { success:'var(--g2)', error:'var(--r2)', info:'var(--blue2)', warning:'var(--a2)' };
  const icons  = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = colors[type];
  toast.style.borderLeftWidth = '3px';
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateY(8px)'; toast.style.transition='all .3s'; setTimeout(()=>toast.remove(), 300); }, 3000);
}

// Format currency
function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style:'currency', currency, maximumFractionDigits:0 }).format(amount || 0);
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

// Format datetime
function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
}

// Status badge HTML
function statusBadge(status) {
  const map = {
    pending:   'badge-amber',
    active:    'badge-green',
    completed: 'badge-blue',
    cancelled: 'badge-red',
  };
  return `<span class="badge ${map[status]||'badge-gray'}">${status}</span>`;
}

// Show loading spinner in a container
function showLoader(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;
}

// Show empty state
function showEmpty(containerId, icon, title, desc) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="empty-state"><div class="empty-icon">${icon}</div><h3>${title}</h3><p>${desc}</p></div>`;
}

// Show alert
function showAlert(message, type = 'error', containerId = 'alert-box') {
  const el = document.getElementById(containerId);
  if (el) { el.className = `alert alert-${type}`; el.innerHTML = `<span>${message}</span>`; el.style.display='flex'; }
}

// Hide alert
function hideAlert(containerId = 'alert-box') {
  const el = document.getElementById(containerId);
  if (el) el.style.display = 'none';
}

// Theme toggle
function initTheme() {
  const saved = localStorage.getItem('pe_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('pe_theme', next);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

// Sidebar nav
function initSidebarNav(activePage) {
  document.querySelectorAll('.sb-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === activePage);
    item.addEventListener('click', () => {
      const pages = document.querySelectorAll('.page');
      pages.forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`page-${item.dataset.page}`);
      if (target) {
        target.classList.add('active');
        document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const title = document.getElementById('page-title');
        if (title) title.textContent = item.querySelector('.sb-label')?.textContent || '';
      }
    });
  });
}

// Sidebar collapse
function initSidebarCollapse() {
  const btn = document.getElementById('sb-toggle');
  const sb  = document.getElementById('sidebar');
  if (btn && sb) {
    btn.addEventListener('click', () => sb.classList.toggle('collapsed'));
  }
}

// Fill user info in sidebar
function fillUserInfo() {
  const user = Auth.getUser();
  if (!user) return;
  const nameEl   = document.getElementById('sb-user-name');
  const roleEl   = document.getElementById('sb-user-role');
  const avatarEl = document.getElementById('sb-avatar');
  if (nameEl)   nameEl.textContent   = user.name;
  if (roleEl)   roleEl.textContent   = user.role;
  if (avatarEl) avatarEl.textContent = user.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
}
