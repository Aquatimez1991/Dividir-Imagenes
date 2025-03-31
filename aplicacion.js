let img = new Image();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

document.getElementById("upload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Cuando la imagen se cargue, dibujarla y actualizar guías
img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    drawGuidelines(); // Asegura que las líneas se dibujen cuando se carga la imagen
};

// Detectar cambios en los inputs y redibujar guías
document.querySelectorAll("input[type='number'], input[type='radio']").forEach(input => {
    input.addEventListener("input", drawGuidelines);
});

// Sincronizar calidad entre slider y input numérico
document.getElementById("quality-range").addEventListener("input", function () {
    document.getElementById("quality-number").value = this.value;
});
document.getElementById("quality-number").addEventListener("input", function () {
    document.getElementById("quality-range").value = this.value;
});

// Función para dibujar líneas guía correctamente
function drawGuidelines() {
    if (!img.complete || img.width === 0 || img.height === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const mode = document.querySelector("input[name='mode']:checked").value;
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
    ctx.lineWidth = 1;

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

// Función para dividir la imagen y almacenar en `localStorage`
function splitImage() {
    const mode = document.querySelector("input[name='mode']:checked").value;
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
    const quality = parseFloat(document.getElementById("quality-number").value) / 100;

    const partWidth = img.width / vert;
    const partHeight = img.height / horz;
    let imagesData = [];

    for (let i = 0; i < vert; i++) {
        for (let j = 0; j < horz; j++) {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = partWidth;
            tempCanvas.height = partHeight;
            const tempCtx = tempCanvas.getContext("2d");

            tempCtx.drawImage(img, -i * partWidth, -j * partHeight);

            let outputFormat = "image/png";
            let extension = "png";

            if (format === "jpeg") {
                outputFormat = "image/jpeg";
                extension = "jpg";
            } else if (format === "webp") {
                outputFormat = "image/webp";
                extension = "webp";
            }

            const dataURL = tempCanvas.toDataURL(outputFormat, quality);
            imagesData.push({ dataURL, extension });
        }
    }

    // Guardamos en localStorage y redirigimos
    localStorage.setItem("splitImages", JSON.stringify(imagesData));
    window.location.href = "preview.html";
}
