CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(128) primary key);
CREATE TABLE valores_hasheados(

    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    informacion VARCHAR(1000),
	  URL_vanilla VARCHAR(200) NOT NULL,
	  URL_modified VARCHAR(200) NOT NULL,
    hash_value_modified VARCHAR (65) NOT NULL
);
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20241121103433');
