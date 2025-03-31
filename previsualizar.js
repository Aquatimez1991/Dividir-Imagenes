document.addEventListener("DOMContentLoaded", function () {
    const previewContainer = document.getElementById("preview-container");
    const downloadButton = document.getElementById("download-selected");
    const imagesData = JSON.parse(sessionStorage.getItem("splitImages")) || [];
    const printButton = document.getElementById("print-button"); // Botón de imprimir

    if (imagesData.length === 0) {
        previewContainer.innerHTML = "<p>No hay imágenes para mostrar.</p>";
        downloadButton.disabled = true; // Deshabilitar botón de descarga
        printButton.disabled = true; // Deshabilitar botón de imprimir
        return;
    }

    imagesData.forEach((imgObj, index) => {
        const img = document.createElement("img");
        img.src = imgObj.imageUrl; // Usamos imageUrl en lugar de dataURL

        img.classList.add("preview-img");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = index;
        checkbox.checked = true;

        const label = document.createElement("label");
        label.appendChild(checkbox);
        label.appendChild(img);

        previewContainer.appendChild(label);
    });

    // Verificar si hay imágenes seleccionadas al hacer clic en descargar
    downloadButton.addEventListener("click", function () {
        const selectedImages = document.querySelectorAll("input[type='checkbox']:checked");

        if (selectedImages.length === 0) {
            alert("Debe seleccionar al menos una imagen para descargar.");
            return;
        }

        selectedImages.forEach((checkbox) => {
            const index = checkbox.value;
            const imgData = imagesData[index];

            const link = document.createElement("a");
            link.href = imgData.imageUrl; // 🔹 Usa imageUrl en lugar de dataURL
            link.download = `corte_${index}.${imgData.extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

       // Evento para imprimir imágenes seleccionadas
       printButton.addEventListener("click", function () {
        const selectedImages = document.querySelectorAll("input[type='checkbox']:checked");

        if (selectedImages.length === 0) {
            alert("Debe seleccionar al menos una imagen para imprimir.");
            return;
        }

        // Obtener los datos de las imágenes seleccionadas
        const selectedImagesData = Array.from(selectedImages).map(checkbox => imagesData[checkbox.value]);

        // Llamar a la función de impresión
        imprimir(selectedImagesData);
    });
    
});
