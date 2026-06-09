# 🚗 ParkEase

Smart Parking Management System built with React, Node.js, Express, and MySQL.

## 📌 Overview

ParkEase is a web-based parking management platform that helps drivers find and book parking spaces while allowing parking owners to manage their parking spots efficiently.

The project aims to reduce parking search time, improve parking space utilization, and provide a seamless experience for both drivers and parking owners.

---

## ✨ Features

### 👤 Authentication

* User Registration
* User Login
* JWT Authentication
* Role-Based Access Control
* Driver & Owner Accounts

### 🚗 Parking Spots

* View Available Parking Spots
* Parking Spot Details
* Owner Spot Management
* Add New Parking Spot
* Update Parking Spot Information
* Delete Parking Spot

### 📊 Owner Features

* Owner Dashboard
* Manage Parking Spaces
* View Registered Spots

### 👨‍💼 Driver Features

* Driver Dashboard
* Browse Parking Locations
* View Parking Information

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Vite

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* MySQL

---

## 📂 Project Structure

ParkeseProject/

├── parkease-frontend/

│ ├── src/

│ ├── components/

│ ├── pages/

│ ├── context/

│ └── api/

│

├── parkese-backend/

│ ├── src/

│ ├── controllers/

│ ├── routes/

│ ├── middleware/

│ ├── config/

│ └── models/

│

└── README.md

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Nishchay2411/Parkese.git
cd Parkese
```

### Backend Setup

```bash
cd parkese-backend
npm install
```

Create a `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=parkease
JWT_SECRET=your_secret_key
```

Run Backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd parkease-frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## 🗄️ Database

Current Tables:

* users
* parking_spots
* bookings
* reviews

---

## 🚀 Future Enhancements

* Booking System
* Google Maps Integration
* Real-Time Parking Availability
* Online Payments
* Parking Analytics
* Admin Dashboard
* Notifications
* Mobile Responsive UI
* Advanced Search & Filters
* GPS Based Spot Discovery

---

## 👨‍💻 Developer

### Nishchay Choudhary

Computer Science Engineering Student

Java Developer | Full Stack Developer

GitHub:
https://github.com/Nishchay2411

LinkedIn:
https://www.linkedin.com/in/nishchay-choudhary-02b6b9372

---

## 📄 License

This project is created for educational and portfolio purposes.
