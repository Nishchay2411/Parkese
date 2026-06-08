const Auth = {
  login(token, user) {
    localStorage.setItem('pe_token', token);
    localStorage.setItem('pe_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('pe_token');
    localStorage.removeItem('pe_user');
    window.location.href = 'login.html';
  },
  getToken() { return localStorage.getItem('pe_token'); },
  getUser()  { const u = localStorage.getItem('pe_user'); return u ? JSON.parse(u) : null; },
  isLoggedIn() { return !!this.getToken(); },
  requireAuth() {
    if (!this.isLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
  },
  redirectToDashboard() {
    const user = this.getUser();
    if (!user) { window.location.href = 'login.html'; return; }
    if (user.role === 'admin') { window.location.href = 'admin.html'; return; }
    if (user.role === 'owner') { window.location.href = 'owner.html'; return; }
    window.location.href = 'driver.html';
  },
};
