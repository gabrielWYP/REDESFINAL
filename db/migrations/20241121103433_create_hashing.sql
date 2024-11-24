-- migrate:up

CREATE TABLE valores_hasheados(

    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    archivo_hasheado VARCHAR(36),
    timestamp_hash DATETIME DEFAULT CURRENT_TIMESTAMP


);


-- migrate:down

DROP TABLE IF EXISTS valores_hasheados;