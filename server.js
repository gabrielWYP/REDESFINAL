const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/app.db'); // Cambia a tu base de datos

const app = express();

// Configurar multer para guardar archivos en la carpeta 'uploads'
const upload = multer({ dest: 'uploads/' });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/modificados', express.static(path.join(__dirname, 'modificados')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.use(express.json());


function sleep(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {
    }
}

const guardarArchivo = (archivoPath, nuevoPath, res) => {
    fs.rename(archivoPath, nuevoPath, (err) => {
        if (err) {
            console.error('Error al mover el archivo:', err.message);
            return res.status(500).send('Error al guardar el archivo.');
        }
    });
}

const ejecutarComandoGuardar = (ejecutable, archivo, destino, timeStamp, res) => {
    const comandoGuardar = `${ejecutable} "${archivo}" "${destino}" "${timeStamp}"`;
    exec(comandoGuardar, (err, stdout, stderr) => {

        if (err) {
            console.error('Error ejecutando el programa C++:', err.message);
            return res.status(500).send('Error al procesar el archivo.');
        }

        if (stderr) {
            console.error('Error en el programa C++:', stderr);
            return res.status(500).send('Error en el programa.');
        }
    });
}

const ejecutarComandoHash = (pathDecode, filePath, res) => {
    return new Promise((resolve, reject) => {
        const comandoHashear = `${pathDecode} "${filePath}"`;
        exec(comandoHashear, (err, stdout, stderr) => {
            if (err) {
                console.error('Error ejecutando el programa C++:', err.message);
                reject('Error al procesar el archivo.');
            } else if (stderr) {
                console.error('Error en el programa C++:', stderr);
                reject('Error en el programa.');
            } else {
                resolve(stdout.trim()); // Resuelve con el hash
            }
        });
    });
}

// Ruta para subir archivos
app.post('/subir-archivo', upload.single('fileInput'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se recibió ningún archivo.');
    }

    const textInput = req.body.textInput;

    //Para guardar el archivo
    const originalFileName = req.file.originalname;
    const filePath = req.file.path;
    const newFilePath = path.join('uploads', originalFileName);

    const originalUrl = `http://localhost:3000/uploads/${originalFileName}`;
    const modifiedUrl = `http://localhost:3000/modificados/${originalFileName}`;

    guardarArchivo(filePath, newFilePath, res);

    //Para subir el archivo y guardar ambos

    const pathReal = `uploads/${originalFileName}`
    const timestamp = new Date().toISOString();
    const pathCarpeta = "modificados/";
    const pathToExecutable = path.resolve(__dirname, 'coder.exe');

    ejecutarComandoGuardar(pathToExecutable,pathReal,pathCarpeta,timestamp,res);

    //Await para ejecutar el comando
    sleep(2000);

    //Para obtener el timeStamp hasheado

    let hashValor = "";

    const actualizarHashValor = async () => {
        try {
            const pathDecoder = path.resolve(__dirname, 'decoder.exe');
            const modFile = `modificados/${originalFileName}`;
    
            // Espera al resultado de la promesa y asigna el valor a la variable global
            hashValor = await ejecutarComandoHash(pathDecoder, modFile, res);
        } catch (error) {
            console.error(error);
        }
    };

    actualizarHashValor().then(() => {
        // Aquí `hashValor` estará actualizado después de que se resuelva la promesa
        console.log('Variable externa hashValor:', hashValor);

        const query = `
            INSERT INTO valores_hasheados (informacion, URL_vanilla, URL_modified, hash_value_modified)
            VALUES (?, ?, ?, ?)
        `;
        db.run(query, [textInput, originalUrl, modifiedUrl, hashValor], function (err) {
            if (err) {
                console.error('Error al guardar en SQLite:', err.message);
                return res.status(500).send('Error al guardar en la base de datos.');
            }

            res.send({
                id: this.lastID,
                informacion: textInput,
                URL_vanilla: originalUrl,
                URL_modified: modifiedUrl,
                hash_value_modified: hashValor,
            });
        });
    });
}); 

// Ruta para servir archivos
app.get('/descargar-archivo/:nombreArchivo', (req, res) => {
    const fileName = req.params.nombreArchivo; 
    const filePath = path.join(__dirname, 'modificados', fileName); 

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send('Error al descargar el archivo');
        }
    });
});


app.post('/buscar-info', upload.single('fileInput'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se recibió ningún archivo.');
    }
    const originalFileName = req.file.originalname;
    const filePath = req.file.path;
    const tempFilePath = path.join('temp', originalFileName);

    try {

        if (!fs.existsSync('temp')) {
            fs.mkdirSync('temp');
        }
        // Mover el archivo a la carpeta temporal
        await guardarArchivo(filePath, tempFilePath, res);

        // Obtener el hash del archivo temporal
        const pathDecoder = path.resolve(__dirname, 'decoder.exe');
        const hashValor = await ejecutarComandoHash(pathDecoder, tempFilePath);

        // Consultar la base de datos para verificar si el hash existe
        const query = `SELECT * FROM valores_hasheados WHERE hash_value_modified = ?`;
        db.get(query, [hashValor], (err, row) => {
            if (err) {
                console.error('Error al consultar la base de datos:', err.message);
                return res.status(500).send('Error al consultar la base de datos.');
            }
            fs.unlink(tempFilePath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo temporal:', err.message);
                }
            });
            
            if (row) {
                res.send({
                    mensaje: 'Archivo encontrado en la base de datos.',
                    data: row.informacion
                });
            } else {
                res.status(404).send('Archivo no encontrado en la base de datos.');
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});


//Pagina principal  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index2.html'));
});

app.get('/buscararchivo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscararchivo.html'));
});

app.get('/subirarchivo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'subirarchivo.html'));
});

app.listen(3000, () => {
    console.log('Servidor backend corriendo en http://localhost:3000');
});
