-- migrate:up

INSERT INTO valores_hasheados (archivo_hasheado) VALUES ('f8f05f79fe0c0f876d26368bd12c08ef31617039ae3104c34f22db9c0afd3bd9');


-- migrate:down

DELETE FROM valores_hasheados;