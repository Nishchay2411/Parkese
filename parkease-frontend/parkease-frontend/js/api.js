// ============================================
// ParkEase — API Helper
// All backend calls go through this file
// ============================================

const API = {
  // Base request method
  async request(endpoint, method = 'GET', body = null) {
    const token = Auth.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
      const res  = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    } catch (err) {
      throw err;
    }
  },

  // ── AUTH ──
  auth: {
    register: (d) => API.request('/auth/register', 'POST', d),
    login:    (d) => API.request('/auth/login',    'POST', d),
    me:       ()  => API.request('/auth/me'),
    update:   (d) => API.request('/auth/update',   'PUT',  d),
  },

  // ── SPOTS ──
  spots: {
    getAll:   (q = '') => API.request(`/spots${q}`),
    getOne:   (id)     => API.request(`/spots/${id}`),
    create:   (d)      => API.request('/spots',      'POST',   d),
    update:   (id, d)  => API.request(`/spots/${id}`,'PUT',    d),
    delete:   (id)     => API.request(`/spots/${id}`,'DELETE'),
    mySpots:  ()       => API.request('/spots/my-spots'),
  },

  // ── BOOKINGS ──
  bookings: {
    create:       (d)        => API.request('/bookings',              'POST', d),
    myBookings:   ()         => API.request('/bookings/my-bookings'),
    spotBookings: ()         => API.request('/bookings/spot-bookings'),
    getOne:       (id)       => API.request(`/bookings/${id}`),
    updateStatus: (id, status)=> API.request(`/bookings/${id}/status`, 'PUT', { status }),
    extend:       (id, hrs)  => API.request(`/bookings/${id}/extend`,  'PUT', { extra_hours: hrs }),
  },

  // ── ADMIN ──
  admin: {
    stats:      ()    => API.request('/admin/stats'),
    users:      ()    => API.request('/admin/users'),
    deleteUser: (id)  => API.request(`/admin/users/${id}`,     'DELETE'),
    bookings:   ()    => API.request('/admin/bookings'),
    toggleSpot: (id)  => API.request(`/admin/spots/${id}/toggle`, 'PUT'),
  },
};
