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

    //Para subir el archivo y guardar ambos

    const pathReal = `uploads/${originalFileName}`
    const timestamp = new Date().toISOString();
    const pathCarpeta = "modificados/";
    
    const pathToExecutable = path.resolve(__dirname, 'coder.exe');
    console.log(pathToExecutable)

    const command_guardar = `${pathToExecutable} "${pathReal}" "${pathCarpeta}" "${timestamp}"`;

    console.log('Ejecutando comando:', command_guardar);

    
    exec(command_guardar, (err, stdout, stderr) => {

        if (err) {
            console.error('Error ejecutando el programa C++:', err.message);
            return res.status(500).send('Error al procesar el archivo.');
        }

        if (stderr) {
            console.error('Error en el programa C++:', stderr);
            return res.status(500).send('Error en el programa.');
        }
    });

    
    //Para obtener el timeStamp hasheado

    const pathDecoder = path.resolve(__dirname, 'decoder.exe')

    const modFile = `modificados/${originalFileName}`

    const command_hash = `${pathDecoder} "${modFile}"`

    console.log("Ejecutando comando: ", command_hash);

    let hash_timeStamp = ""
    
    exec(command_hash, (err, stdout, stderr) => {

        if (err) {
            console.error('Error ejecutando el programa C++:', err.message);
            return res.status(500).send('Error al procesar el archivo.');
        }

        if (stderr) {
            console.error('Error en el programa C++:', stderr);
            return res.status(500).send('Error en el programa.');
        }

        hash_timeStamp = stdout.trim();
        console.log(hash_timeStamp);

        
        
        
        
        
    });

        /*
        console.log('hash encontrado', hash);

        const query = `INSERT INTO valores_hasheados (archivo_hasheado, timestamp_hash) VALUES (?, ?)`;
        db.run(query, [hash, new Date().toISOString()], function (err) {
            if (err) {
                console.error('Error al guardar en SQLite:', err.message);
                return res.status(500).send('Error al guardar en la base de datos.');
            }
        */
    

    //http://localhost:3000/uploads/nombreArchivo
    //http://localhost:3000/modificados/nombreArchivo
}); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/modificados', express.static(path.join(__dirname, 'modificados')));


//Ruta para servir archivos
// Ruta para servir archivos
//CAMBIAR LA RUTAAAAAAAAAAAAAAA DAAAAAAAAAAAAAAAAAAAAA
// Ruta para servir archivos
app.get('/descargar-archivo', (req, res) => {
    const fileName = 'RepasoMod.pdf'; // Cambia esto al nombre exacto de tu archivo con su extensión
    const filePath = path.join(__dirname, 'modificados', fileName); // Ruta completa al archivo en la carpeta 'modificado'

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo');
        }
    });
});



app.get('/buscar-info', (req, res) => {
    const filePath = req.query.filePath; // Ruta del archivo enviada en la solicitud
    if (!filePath) {
        return res.status(400).send('Es necesario proporcionar la ruta del archivo.');
    }

    console.log('Ruta recibida:', filePath);

    // Normalizamos la ruta recibida para asegurarnos de que esté correcta
    const normalizedFilePath = path.normalize(filePath); 
    const absoluteFilePath = path.resolve(__dirname, normalizedFilePath); // Ruta absoluta al archivo

    // Verificamos si el archivo existe
    if (!fs.existsSync(absoluteFilePath)) {
        return res.status(400).send('El archivo especificado no existe.');
    }

    // Ruta al ejecutable (asegúrate de que esta ruta también sea correcta)
    const pathToExecutable = path.resolve(__dirname, 'decoder.exe');
    console.log('Ruta del ejecutable:', pathToExecutable);

    // Aquí creamos la ruta relativa correctamente, asegurándonos de agregar '..\\..\\' al principio
    const relativeFilePath = `${normalizedFilePath.replace(path.resolve(__dirname, ''), '').replace(/\\/g, '\\\\')}`;

    // Mostrar la ruta relativa que estamos pasando al ejecutable
    console.log('Ruta relativa para el comando:', relativeFilePath);

    // Ahora, construimos el comando pasando la ruta relativa correctamente
    const command = `"${pathToExecutable}" "${relativeFilePath}"`;

    console.log('Ejecutando comando:', command);

    // Ejecutamos el comando
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error('Error al ejecutar decoder.exe:', err.message);
            return res.status(500).send('Error al procesar el archivo.');
        }

        if (stderr) {
            console.error('Error en el programa decoder.exe:', stderr);
            return res.status(500).send('Error en el programa.');
        }

        const last64Chars = stdout.trim(); // Obtener los últimos 64 caracteres
        console.log(last64Chars);

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
