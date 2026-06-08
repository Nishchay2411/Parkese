# 🚗 ParkEase Backend API

Complete REST API for ParkEase — Urban Parking Marketplace

---

## 🚀 Setup (Step by Step)

### 1. Install dependencies
```bash
npm install
```

### 2. Setup MySQL Database
Open MySQL and run:
```bash
mysql -u root -p < database.sql
```

### 3. Create .env file
```bash
cp .env.example .env
```
Edit `.env` and add your MySQL password and a JWT secret.

### 4. Start server
```bash
npm run dev     # development (auto-restart)
npm start       # production
```

Server runs at: **http://localhost:5000**

---

## 📋 API Endpoints

### Auth Routes `/api/auth`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create account | ❌ |
| POST | `/login` | Login | ❌ |
| GET | `/me` | Get my profile | ✅ |
| PUT | `/update` | Update profile | ✅ |
| PUT | `/change-password` | Change password | ✅ |

### Spot Routes `/api/spots`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all spots (with filters) | ❌ |
| GET | `/:id` | Get single spot | ❌ |
| GET | `/my-spots` | Owner's spots | Owner |
| POST | `/` | Create spot | Owner |
| PUT | `/:id` | Update spot | Owner |
| DELETE | `/:id` | Delete spot | Owner |

### Booking Routes `/api/bookings`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create booking | Driver |
| GET | `/my-bookings` | My bookings | Driver |
| GET | `/spot-bookings` | Bookings for my spots | Owner |
| GET | `/:id` | Get booking details | ✅ |
| PUT | `/:id/status` | Update status | ✅ |
| PUT | `/:id/extend` | Extend booking | Driver |

### Admin Routes `/api/admin`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | Dashboard stats | Admin |
| GET | `/users` | All users | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| GET | `/bookings` | All bookings | Admin |
| PUT | `/spots/:id/toggle` | Toggle spot | Admin |

---

## 🔐 Authentication

All protected routes need this header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📁 Folder Structure

```
parkease-backend/
├── src/
│   ├── server.js           # Main entry point
│   ├── config/
│   │   └── database.js     # MySQL connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── spotController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── spotRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   └── middleware/
│       └── auth.js         # JWT verification
├── database.sql            # Database schema
├── .env.example            # Environment variables template
└── package.json
```

---

Built with ❤️ — Node.js + Express + MySQL + JWT
