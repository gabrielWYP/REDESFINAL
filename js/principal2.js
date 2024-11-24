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
            // Mostrar el texto extraído con el mensaje inicial
            resultMessage.innerHTML = `<p id= "success"><b>Se encontró el mensaje:</b></p><br> ${data.data}`;
            resultMessage.classList.remove("hidden");
        } else {
            // Mostrar el mensaje del ID 'denied'
            document.getElementById("denied").classList.remove("hidden");
            resultMessage.classList.add("hidden");
        }
    })
    
    .catch(error => {
        console.error('Error al verificar el archivo:', error);
            
        resultMessage.classList.remove("hidden");
        resultContainer.classList.add("hidden");
    });

    setTimeout(() => {
        window.location.href = '/'; // Redirige a la página principal
    }, 10000); // 10000 milisegundos = 10 segundos
});