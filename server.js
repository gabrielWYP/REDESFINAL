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
//Ruta para subir archivos


    /*const newFilePath = path.join('modificados', `modificado_${originalFileName}`);

    // Leer el archivo y agregar la fecha
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err.message);
            return res.status(500).send('Error al procesar el archivo.');
        }

        // Obtener la fecha y hora actual
        const now = new Date();
        const fecha = now.toISOString();

        // Agregar la fecha al contenido del archivo
        const contenidoModificado = `${data}\n\nFecha: ${fecha}`;

        // Guardar el archivo modificado
        fs.writeFile(newFilePath, contenidoModificado, 'utf8', (err) => {
            if (err) {
                console.error('Error al guardar el archivo modificado:', err.message);
                return res.status(500).send('Error al guardar el archivo modificado.');
            }

            // Eliminar el archivo temporal original
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error al eliminar archivo temporal:', err.message);
            });

            // Devolver la ruta de descarga del archivo modificado  
            res.send({
                mensaje: 'Archivo registrado exitosamente.',
                rutaDescarga: `/descargar-archivo/${path.basename(newFilePath)}`
            });
        });
    }); */



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
