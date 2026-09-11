-- D1: contador de likes del blog (sin login).
-- Aplicar con:
--   npx wrangler d1 execute adriantele-likes --remote --file=schema/likes.sql

CREATE TABLE IF NOT EXISTS likes (
  slug       TEXT NOT NULL,
  visitor    TEXT NOT NULL,          -- sha256(sal | IP | user-agent | slug)
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (slug, visitor)        -- un like por visitante por artículo
);

CREATE INDEX IF NOT EXISTS idx_likes_slug ON likes (slug);
CREATE INDEX IF NOT EXISTS idx_likes_created ON likes (created_at);
