let textInput = ""; // Variable para el texto ingresado
let file = null; // Variable para el archivo seleccionado
let isLoading = false; // Estado para la animación de carga

const handleFileChange = (event) => {
    file = event.target.files[0];
};

const handleSubmit = (event) => {
    event.preventDefault();

    const textArea = document.getElementById("textInput");
    textInput = textArea.value.trim();

    if (textInput.trim() === "") {
        alert("El campo de texto está vacío.");
        return;
    }
    if (!file) {
        alert("No se ha seleccionado ningún archivo.");
        return;
    }

    const formData = new FormData();
    const fileInput = document.getElementById('fileInput').files[0];

    formData.append('fileInput', fileInput);
    formData.append('textInput', textInput);

                fetch('/subir-archivo', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                })
                .catch(error => {
                    console.error('Error al subir el archivo:', error);
                    alert('Hubo un error al procesar el archivo.');
                });


    alert(`Texto enviado: ${textInput}\nArchivo enviado: ${file.name}`);
    // Aquí puedes implementar el envío de datos a un servidor

    // Iniciar la animación de carga
    const loader = document.getElementById("loader");
    const result = document.getElementById("result");
    loader.classList.remove("hidden");
    result.classList.add("hidden");

    isLoading = true;

    setTimeout(() => {
        // Simula la subida del archivo
        const downloadLink = document.getElementById("downloadLink");
        const objectURL = `http://localhost:3000/modificados/${file.name}`;  // Crea una URL temporal del archivo
        downloadLink.href = objectURL;
        downloadLink.download = file.name;  // El archivo se descargará con el nombre original

        loader.classList.add("hidden");
        result.classList.remove("hidden");

        isLoading = false;
    }, 2000); // Tiempo de simulación (2 segundos)
};

// Asigna los manejadores de eventos
document.getElementById("fileInput").addEventListener("change", handleFileChange);
document.getElementById("uploadForm").addEventListener("submit", handleSubmit);

document.getElementById("downloadLink").addEventListener("click", () => {
    setTimeout(() => {
        // Redirigir automáticamente a index2.html después de 3 segundos
        window.location.href = '/';
    }, 3000); // Tiempo de espera (3 segundos)
});