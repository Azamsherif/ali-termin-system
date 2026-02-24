-- Ali Termin System schema (utf8mb4)
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  plan ENUM('starter','pro','business') DEFAULT 'starter',
  sms_quota INT DEFAULT 500,
  whatsapp_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  client_language VARCHAR(5) DEFAULT 'de',
  appointment_datetime DATETIME NOT NULL,
  status ENUM('confirmed','cancelled') DEFAULT 'confirmed',
  reminder_24_sent BOOLEAN DEFAULT FALSE,
  reminder_2_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_datetime (user_id, appointment_datetime),
  CONSTRAINT fk_appointments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS message_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  appointment_id INT NULL,
  channel ENUM('sms','whatsapp') NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('sent','failed','pending') DEFAULT 'pending',
  provider_id VARCHAR(255) NULL,
  error_text TEXT NULL,
  attempts INT DEFAULT 0,
  next_retry_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_status (user_id, status),
  INDEX idx_retry (status, next_retry_at),
  CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_logs_appt FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
) ENGINE=InnoDB;
