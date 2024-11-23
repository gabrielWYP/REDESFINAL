const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configurar multer para guardar archivos en la carpeta 'uploads'
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Ruta para subir archivos
app.post('/subir-archivo', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se recibió ningún archivo.');
    }

    const filePath = req.file.path;  // Ruta del archivo temporal
    const originalFileName = req.file.originalname;  // Nombre original del archivo
    const newFilePath = path.join('uploads', originalFileName);  // Ruta donde se guardará el archivo
    const timestamp = new Date().toISOString();
    const pathCarpeta = 'modificados/'

    const pathToExecutable = path.resolve(__dirname, 'hashing/logica/coder.exe');
    const command = `"${pathToExecutable}" "${filePath}" "${pathCarpeta}" "${timestamp}"`;

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
                timestamp: timestamp,
            });
        });

        fs.unlink(filePath, (err) => {
            if (err) console.error('Error al eliminar archivo temporal:', err.message);
        });
    });




    // Mover el archivo del directorio temporal a su destino final
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
});


//Ruta para servir archivos
// Ruta para servir archivos
app.get('/descargar-archivo', (req, res) => {
    const filePath = path.join(__dirname, 'modificado', 'nombre_del_archivo.ext'); // Reemplaza con el nombre de tu archivo
    res.download(filePath, 'archivo_descargado.ext', (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo');
        }
    });
});

//Ruta para buscar archivos
app.get('/buscar-info', (req,res) => {
    //Se tiene que ingresar un archivo previamente modificado
    //Se extrae el valor hash de los ultimos 64 digitos
    //Se busca en la base de datos
    //Si coincide, enviar de vuelta credenciales, sino se notifica el rechazo de la sesion
});

//Pagina principal  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor backend corriendo en http://localhost:3000');
});
