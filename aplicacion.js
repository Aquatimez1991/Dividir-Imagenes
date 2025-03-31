let img = new Image();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let selectedFile = null; // Para rastrear si hay una imagen válida cargada
window.splitImage = splitImage;

const qualityRange = document.getElementById("quality-range");
const qualityNumber = document.getElementById("quality-number");

function toggleQualityControls() {
    const selectedFormat = document.querySelector("input[name='format']:checked").value;
    if (selectedFile?.type === "image/png" || selectedFormat === "png") {
        qualityRange.disabled = true;
        qualityNumber.disabled = true;
    } else {
        qualityRange.disabled = false;
        qualityNumber.disabled = false;
    }
}



document.getElementById("upload").addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) {
        alert("Debe seleccionar un archivo válido.");
        return;
    }

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
        alert("Debe seleccionar un archivo de imagen válido (JPG, PNG, WEBP, etc.).");
        this.value = ""; // Resetear input
        document.getElementById("file-name").textContent = "Ningún archivo seleccionado";
        selectedFile = null;
        return;
    }

    selectedFile = file; // Guardamos el archivo como válido
    document.getElementById("file-name").textContent = file.name;
    toggleQualityControls(); // Verificamos si hay que deshabilitar los controles de calidad

    const reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.querySelectorAll("input[name='format']").forEach(input => {
    input.addEventListener("change", toggleQualityControls);
});

img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    drawGuidelines();
};

document.querySelectorAll("input[name='mode'], input[type='number']").forEach(input => {
    input.addEventListener("input", drawGuidelines);
});

document.getElementById("quality-range").addEventListener("input", function () {
    document.getElementById("quality-number").value = this.value;
});

document.getElementById("quality-number").addEventListener("input", function () {
    document.getElementById("quality-range").value = this.value;
});

function splitImage() {
    if (!selectedFile) {
        alert("Debe seleccionar un archivo antes de dividir la imagen.");
        return;
    }

    const selectedMode = document.querySelector("input[name='mode']:checked");
    if (!selectedMode) {
        alert("Debe seleccionar al menos una opción: Vertical, Horizontal o Ambas.");
        return;
    }

    const mode = selectedMode.value;
    let vert = 1, horz = 1;

    if (mode === "vertical") {
        vert = parseInt(document.getElementById("vertical").value) || 1;
    } else if (mode === "horizontal") {
        horz = parseInt(document.getElementById("horizontal").value) || 1;
    } else if (mode === "grid") {
        vert = parseInt(document.getElementById("vertical").value) || 1;
        horz = parseInt(document.getElementById("horizontal").value) || 1;
    }

    const format = document.querySelector("input[name='format']:checked").value;
    const quality = format === "png" ? 1.0 : parseFloat(document.getElementById("quality-number").value) / 100;

    const partWidth = img.width / vert;
    const partHeight = img.height / horz;
    let imagesData = [];
    let processedImages = 0; // Contador de imágenes procesadas

    for (let i = 0; i < vert; i++) {
        for (let j = 0; j < horz; j++) {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = partWidth;
            tempCanvas.height = partHeight;
            const tempCtx = tempCanvas.getContext("2d");
    
            tempCtx.drawImage(img, -i * partWidth, -j * partHeight);
    
            let outputFormat;
            let extension;
    
            // Si el usuario selecciona "mismo que la entrada"
            if (format === "original") {
                outputFormat = selectedFile.type; 
                extension = selectedFile.type.split("/")[1]; // Extraer la extensión real
            } else if (format === "jpeg") {
                outputFormat = "image/jpeg";
                extension = "jpg";
            } else if (format === "webp") {
                outputFormat = "image/webp";
                extension = "webp";
            } else {
                outputFormat = "image/png"; // Si no se elige nada, por defecto PNG
                extension = "png";
            }
    
            // Convertir el canvas directamente a DataURL con el formato seleccionado
            const imageUrl = tempCanvas.toDataURL(outputFormat, quality);
            imagesData.push({ imageUrl, extension });
    
            processedImages++; // Contamos la imagen procesada
    
            // Cuando todas las imágenes estén listas, almacenamos y redirigimos
            if (processedImages === vert * horz) {
                sessionStorage.setItem("splitImages", JSON.stringify(imagesData));
                window.location.href = "preview.html";
            }
        }
    }
    
}


function drawGuidelines() {
    if (!img.complete || img.width === 0 || img.height === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const selectedMode = document.querySelector("input[name='mode']:checked");
    if (!selectedMode) return;

    const mode = selectedMode.value;
    let vert = 1, horz = 1;

    if (mode === "vertical") {
        vert = parseInt(document.getElementById("vertical").value) || 1;
    } else if (mode === "horizontal") {
        horz = parseInt(document.getElementById("horizontal").value) || 1;
    } else if (mode === "grid") {
        vert = parseInt(document.getElementById("vertical").value) || 1;
        horz = parseInt(document.getElementById("horizontal").value) || 1;
    }

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (mode === "vertical" || mode === "grid") {
        for (let i = 1; i < vert; i++) {
            let x = (canvas.width / vert) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }

    if (mode === "horizontal" || mode === "grid") {
        for (let j = 1; j < horz; j++) {
            let y = (canvas.height / horz) * j;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
}

