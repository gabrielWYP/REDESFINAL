const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json());

const db = new sqlite3.Database('db/app.db', (err) => {
    if (err) {
        console.error('Error al conectar a SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite (app.db).');
    }
});

//Ruta para subir archivos
app.post('/subir-archivo', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se recibió ningún archivo.');
    }

    const filePath = req.file.path;

    const pathToExecutable = path.resolve(__dirname, 'hashing/logica/main.exe');
    const command = `"${pathToExecutable}" "${filePath}"`; 

    exec(command, (err, stdout, stderr) => {

        if (err) {
            console.error('Error ejecutando el programa C++:', err.message);
            return res.status(500).send('Error al procesar el archivo.');
        }

        if (stderr) {
            console.error('Error en el programa C++:', stderr);
            return res.status(500).send('Error en el programa.');
        }

        const hash = stdout.trim(); 
        console.log('hash encontrado', hash);

        const query = `INSERT INTO valores_hasheados (archivo_hasheado, timestamp_hash) VALUES (?, ?)`;
        db.run(query, [hash, new Date().toISOString()], function (err) {
            if (err) {
                console.error('Error al guardar en SQLite:', err.message);
                return res.status(500).send('Error al guardar en la base de datos.');
            }

            res.send({
                mensaje: 'Archivo registrado exitosamente.',
                hash: hash,
                id: this.lastID,
                timestamp: new Date().toISOString(),
            });
        });

        fs.unlink(filePath, (err) => {
            if (err) console.error('Error al eliminar archivo temporal:', err.message);
        });
    });
});


//Ruta para servir archivos
app.get('/servir-archivos', (req,res) => {

});

//Ruta para buscar archivos


//Pagina principal  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor backend corriendo en http://localhost:3000');
});
