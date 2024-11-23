const imageForm = document.getElementById("imageForm");
const resultMessage = document.getElementById("resultMessage");
const resultContainer = document.getElementById("imageResult");
const downloadLink = document.getElementById("downloadLink");

imageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const imageInput = document.getElementById("imageInput");

    // Validar si se seleccionó un archivo
    if (!imageInput.files.length) {
        alert("Por favor, selecciona un archivo para verificar.");
        return;
    }

    const uploadedFile = imageInput.files[0];

    const formData = new FormData();
    formData.append('fileInput', uploadedFile);

    fetch('/buscar-info', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Archivo encontrado en la base de datos.') {
            // Mostrar mensaje de éxito
            resultMessage.textContent = data.data;
            resultMessage.classList.remove("hidden");
        } else {
            // Mostrar mensaje de error y ocultar resultados previos
            resultMessage.textContent = "El archivo no se encuentra en la base de datos.";
            resultMessage.classList.remove("hidden");
            resultContainer.classList.add("hidden");
        }
    })
    .catch(error => {
        console.error('Error al verificar el archivo:', error);
            
        resultMessage.classList.remove("hidden");
        resultContainer.classList.add("hidden");
    });
});