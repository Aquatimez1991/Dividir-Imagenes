document.addEventListener("DOMContentLoaded", function () {
    const previewContainer = document.getElementById("preview-container");
    const imagesData = JSON.parse(localStorage.getItem("splitImages")) || [];

    if (imagesData.length === 0) {
        previewContainer.innerHTML = "<p>No hay imágenes para mostrar.</p>";
        return;
    }

    imagesData.forEach((imgObj, index) => {
        const img = document.createElement("img");
        img.src = imgObj.dataURL;
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

    // Descargar imágenes seleccionadas
    document.getElementById("download-selected").addEventListener("click", function () {
        const selectedImages = document.querySelectorAll("input[type='checkbox']:checked");
        selectedImages.forEach((checkbox) => {
            const index = checkbox.value;
            const imgData = imagesData[index];

            const link = document.createElement("a");
            link.href = imgData.dataURL;
            link.download = `corte_${index}.${imgData.extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
});
