-- ============================================
-- ParkEase Database Schema
-- Run this file in MySQL to setup the database
-- ============================================

CREATE DATABASE IF NOT EXISTS parkease;
USE parkease;

-- ── USERS TABLE ──
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  phone       VARCHAR(20),
  role        ENUM('driver', 'owner', 'admin') DEFAULT 'driver',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── PARKING SPOTS TABLE ──
CREATE TABLE IF NOT EXISTS parking_spots (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  owner_id      INT NOT NULL,
  title         VARCHAR(150) NOT NULL,
  description   TEXT,
  address       VARCHAR(255) NOT NULL,
  city          VARCHAR(100) NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  total_slots   INT DEFAULT 1,
  available_slots INT DEFAULT 1,
  latitude      DECIMAL(10, 8),
  longitude     DECIMAL(11, 8),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── BOOKINGS TABLE ──
CREATE TABLE IF NOT EXISTS bookings (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  driver_id     INT NOT NULL,
  spot_id       INT NOT NULL,
  start_time    DATETIME NOT NULL,
  end_time      DATETIME NOT NULL,
  hours         DECIMAL(5,2) NOT NULL,
  total_amount  DECIMAL(10,2) NOT NULL,
  status        ENUM('pending','active','completed','cancelled') DEFAULT 'pending',
  vehicle_number VARCHAR(20),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (spot_id)   REFERENCES parking_spots(id) ON DELETE CASCADE
);

-- ── REVIEWS TABLE ──
CREATE TABLE IF NOT EXISTS reviews (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL UNIQUE,
  driver_id  INT NOT NULL,
  spot_id    INT NOT NULL,
  rating     INT CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (driver_id)  REFERENCES users(id),
  FOREIGN KEY (spot_id)    REFERENCES parking_spots(id)
);

-- ── SAMPLE DATA ──
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin User',   'admin@parkease.com',  '$2a$10$example_hashed_password', '9999999999', 'admin'),
('John Driver',  'john@example.com',    '$2a$10$example_hashed_password', '9876543210', 'driver'),
('Mary Owner',   'mary@example.com',    '$2a$10$example_hashed_password', '9123456789', 'owner');

INSERT INTO parking_spots (owner_id, title, address, city, price_per_hour, total_slots, available_slots) VALUES
(3, 'Central Mall Parking', 'MG Road, Near Central Mall', 'Indore', 30.00, 5, 5),
(3, 'Railway Station Parking', 'Near Indore Railway Station', 'Indore', 20.00, 3, 3),
(3, 'Vijay Nagar Spot', 'Scheme 54, Vijay Nagar', 'Indore', 25.00, 2, 2);

SELECT 'Database setup complete!' AS Status;
