# 🅿️ ParkEase Frontend

Complete multi-page frontend for ParkEase — Urban Parking Marketplace.

---

## 📁 File Structure

```
parkease-frontend/
├── index.html        ← Landing page (public)
├── login.html        ← Login page
├── register.html     ← Register page
├── driver.html       ← Driver dashboard
├── owner.html        ← Owner dashboard
├── admin.html        ← Admin dashboard
├── css/
│   └── style.css     ← All shared styles + dark/light theme
└── js/
    ├── config.js     ← API base URL (change this for deployment)
    ├── auth.js       ← Login/logout/token helpers
    ├── api.js        ← All backend API calls
    └── utils.js      ← Toast, formatters, theme toggle
```

---

## 🚀 How to Use

### Step 1 — Start your backend
```bash
cd parkease-backend
npm run dev
# Running on http://localhost:5000
```

### Step 2 — Open frontend
Just open `index.html` in your browser using **Live Server** in VS Code.

Or simply double-click any `.html` file.

### Step 3 — Login
Use one of these accounts (after running `database.sql`):
- **Driver:** john@example.com / password123
- **Owner:** mary@example.com / password123
- **Admin:** admin@parkease.com / password123

---

## 🌐 Deploying Online

### Frontend → Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Sign up → **Add new site** → **Deploy manually**
3. Drag & drop the entire `parkease-frontend` folder
4. Your site is live! e.g. `https://parkease.netlify.app`

### Backend → Railway (Free)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add MySQL database
4. Set environment variables
5. Get your backend URL

### ⚠️ After deploying backend, update this line in `js/config.js`:
```js
API_BASE_URL: 'https://your-backend.railway.app/api'
```

---

## 🎨 Features

| Page | Features |
|------|---------|
| Landing | Hero, Features, Pricing, Testimonials, FAQ, Dark/Light |
| Login | JWT auth, redirect by role, demo credentials |
| Register | Role selection (Driver/Owner), form validation |
| Driver | Find spots, book, extend, cancel, booking history |
| Owner | Add/edit/delete spots, manage bookings, earnings |
| Admin | All users, all spots, all bookings, delete users, toggle spots |

---

## 🔗 API Connection

All API calls are in `js/api.js`. Change the base URL in `js/config.js`:

```js
const CONFIG = {
  API_BASE_URL: 'http://localhost:5000/api', // ← Change after deploy
};
```

---

Built with HTML5 · CSS3 · Vanilla JS · Connected to Node.js + Express + MySQL Backend
