const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('app.db'); // Cambia a tu base de datos

const app = express();

// Configurar multer para guardar archivos en la carpeta 'uploads'
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Ruta para subir archivos
app.post('/subir-archivo', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se recibió ningún archivo.');
    }
    const originalFileName = req.file.originalname;

    const filePath = req.file.path;
    const newFilePath = path.join('uploads', originalFileName);
    console.log(newFilePath)

    fs.rename(filePath, newFilePath, (err) => {
        if (err) {
            console.error('Error al mover el archivo:', err.message);
            return res.status(500).send('Error al guardar el archivo.');
        }

        // Devolver la ruta de descarga del archivo guardado
        res.send({
            mensaje: 'Archivo subido y guardado exitosamente.',
            rutaArchivo: `/descargar-archivo/${path.basename(newFilePath)}`
        });
    });


    const pathReal = `uploads/${originalFileName}`
    const timestamp = new Date().toISOString();
    const pathCarpeta = "modificados/";
    
    const pathToExecutable = path.resolve(__dirname, 'coder.exe');
    console.log(pathToExecutable)

    const command = `${pathToExecutable} "${pathReal}" "${pathCarpeta}" "${timestamp}"`;

    console.log('Ejecutando comando:', command);
    
    exec(command, (err, stdout, stderr) => {

        if (err) {
            console.error('Error ejecutando el programa C++:', err.message);
            return res.status(500).send('Error al procesar el archivo.');
        }

        if (stderr) {
            console.error('Error en el programa C++:', stderr);
            return res.status(500).send('Error en el programa.');
        }
        /*const hash = stdout.trim(); 
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
                timestamp: timestamp,
            });
        }); */
    });
});


//Ruta para servir archivos
// Ruta para servir archivos
//CAMBIAR LA RUTAAAAAAAAAAAAAAA DAAAAAAAAAAAAAAAAAAAAA
app.get('/descargar-archivo', (req, res) => {
    const fileName = 'Repaso.pdf'; // Cambia esto al nombre exacto de tu archivo con su extensión
    const filePath = path.join(__dirname, 'uploads', fileName); // Ruta completa al archivo en la carpeta 'modificado'

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo');
        }
    });
});

app.get('/buscar-info', (req, res) => {
    const filePath = req.query.filePath; // Ruta del archivo enviado en la solicitud (e.g., /buscar-info?filePath=tu_archivo.txt)
    if (!filePath) {
        return res.status(400).send('Es necesario proporcionar la ruta del archivo.');
    }

    // Asegúrate de que la ruta del archivo esté correctamente formateada (usar path.resolve para evitar problemas con las rutas relativas)
    const resolvedFilePath = path.resolve(filePath);

    // Asegúrate de que el archivo existe antes de ejecutar el comando
    if (!fs.existsSync(resolvedFilePath)) {
        return res.status(400).send('El archivo especificado no existe.');
    }

    // Asegúrate de que el pathToExecutable apunte correctamente al archivo .exe
    const pathToExecutable = path.resolve(__dirname, 'hashing/logica/prueba2.exe');
    
    // Construir el comando correctamente, pasándole la ruta del archivo al ejecutable
    const command = `"${pathToExecutable}" "${resolvedFilePath}"`;

    console.log('Ejecutando comando:', command); // Verifica que el comando se está construyendo correctamente

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error('Error al ejecutar prueba2.exe:', err.message);
            return res.status(500).send('Error al procesar el archivo.');
        }

        if (stderr) {
            console.error('Error en el programa prueba2.exe:', stderr);
            return res.status(500).send('Error en el programa.');
        }

        const last64Chars = stdout.trim(); // Obtener el valor de salida (últimos 64 caracteres)
        console.log('Últimos 64 caracteres:', last64Chars); // Esto te ayudará a ver el valor en los logs

        // Aquí va el código de la base de datos para verificar el hash...
        // Consulta en la base de datos si hay coincidencia con `last64Chars`
        // ...

        res.send({
            mensaje: 'Comando ejecutado correctamente.',
            hash: last64Chars
        });
    });
});

//Pagina principal  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor backend corriendo en http://localhost:3000');
});
