CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(128) primary key);
CREATE TABLE valores_hasheados(

    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    archivo_hasheado VARCHAR(36),
    timestamp_hash DATETIME DEFAULT CURRENT_TIMESTAMP


);
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20241121103433');
