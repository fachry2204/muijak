-- Database Schema for MUI DKI Jakarta
-- Engine: InnoDB
-- Character Set: utf8mb4

CREATE TABLE `users` (
  `id` CHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'STAFF', 'ANGGOTA') NOT NULL DEFAULT 'ANGGOTA',
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
  `avatar_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `menus` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT NULL,
  `title_id` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NULL,
  `title_ar` VARCHAR(255) NULL,
  `url` VARCHAR(255) NOT NULL,
  `order_index` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `menus`(`id`) ON DELETE CASCADE
);

CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_id` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NULL,
  `name_ar` VARCHAR(255) NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE `news` (
  `id` CHAR(36) PRIMARY KEY,
  `title_id` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NULL,
  `title_ar` VARCHAR(255) NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `content_id` LONGTEXT NOT NULL,
  `content_en` LONGTEXT NULL,
  `content_ar` LONGTEXT NULL,
  `image_url` VARCHAR(255) NULL,
  `youtube_url` VARCHAR(255) NULL,
  `category_id` INT,
  `author_id` CHAR(36),
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_trending` BOOLEAN DEFAULT FALSE,
  `views` INT DEFAULT 0,
  `status` ENUM('DRAFT', 'PUBLISHED') DEFAULT 'DRAFT',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE `news_tags` (
  `news_id` CHAR(36),
  `tag_name` VARCHAR(50),
  PRIMARY KEY (`news_id`, `tag_name`),
  FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE
);

CREATE TABLE `komisi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_id` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NULL,
  `name_ar` VARCHAR(255) NULL,
  `chairman` VARCHAR(255) NULL,
  `description_id` TEXT NULL,
  `description_en` TEXT NULL,
  `description_ar` TEXT NULL,
  `programs_id` TEXT NULL,
  `programs_en` TEXT NULL,
  `programs_ar` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `leaders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `position_id` VARCHAR(255) NOT NULL,
  `position_en` VARCHAR(255) NULL,
  `position_ar` VARCHAR(255) NULL,
  `image_url` VARCHAR(255) NULL,
  `biography_id` TEXT NULL,
  `biography_en` TEXT NULL,
  `biography_ar` TEXT NULL,
  `order_index` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `halal_articles` (
  `id` CHAR(36) PRIMARY KEY,
  `title_id` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NULL,
  `title_ar` VARCHAR(255) NULL,
  `content_id` LONGTEXT NOT NULL,
  `content_en` LONGTEXT NULL,
  `content_ar` LONGTEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `pku_articles` (
  `id` CHAR(36) PRIMARY KEY,
  `title_id` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NULL,
  `title_ar` VARCHAR(255) NULL,
  `type` ENUM('ARTIKEL', 'KAJIAN', 'PENELITIAN') NOT NULL,
  `content_id` LONGTEXT NOT NULL,
  `content_en` LONGTEXT NULL,
  `content_ar` LONGTEXT NULL,
  `file_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `audit_logs` (
  `id` CHAR(36) PRIMARY KEY,
  `user_id` CHAR(36),
  `action` VARCHAR(255) NOT NULL,
  `entity` VARCHAR(255) NOT NULL,
  `entity_id` VARCHAR(255) NULL,
  `details` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE `settings` (
  `key_name` VARCHAR(100) PRIMARY KEY,
  `value` TEXT NULL
);

-- Indexes for performance optimization
CREATE INDEX idx_news_status_created_at ON news(status, created_at);
CREATE INDEX idx_news_category ON news(category_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_news_slug ON news(slug);
