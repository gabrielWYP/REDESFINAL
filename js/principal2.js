const imageForm = document.getElementById("imageForm");
const resultMessage = document.getElementById("resultMessage");

// Contenedor para mostrar el resultado
const resultContainer = document.createElement("div");
resultContainer.id = "imageResult";
document.querySelector(".principal2-container").appendChild(resultContainer);

imageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const imageInput = document.getElementById("imageInput");

    // Validar si se seleccionó una imagen
    if (!imageInput.files.length) {
        alert("Por favor, selecciona una imagen para verificar.");
        return;
    }

    const uploadedFile = imageInput.files[0];
    const uploadedFileName = uploadedFile.name.toLowerCase();

    // Verificar si la imagen es "img1.jpg"
    if (uploadedFileName === "img1.jpg") {
        resultMessage.textContent = "¡Imagen encontrada! Aquí está la imagen original:";
        resultMessage.classList.remove("hidden");

        // Mostrar la imagen original
        resultContainer.innerHTML = `
            <div class="result">
                <img src="/Front2/images/imgoriginal.jpg" alt="Imagen original" />
            </div>
        `;
    } else {
        resultMessage.textContent = "La imagen no se encuentra en la base de datos.";
        resultMessage.classList.remove("hidden");

        // Limpiar cualquier resultado previo
        resultContainer.innerHTML = "";
    }
});

