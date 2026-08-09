ALTER TABLE news
  ADD COLUMN deleted_at DATETIME NULL AFTER published_at;

-- Berita yang sudah berada di tong sampah mulai dihitung sejak migrasi dijalankan.
UPDATE news
SET deleted_at = NOW()
WHERE status = 'TRASHED' AND deleted_at IS NULL;

CREATE INDEX idx_news_trash_expiry ON news (status, deleted_at);
