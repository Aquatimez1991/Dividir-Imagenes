function imprimir(imagesData) {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
        <html>
        <head>
            <title>Impresión A4</title>
            <style>
                @page { size: A4; margin: 0; }
                body { margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; }
                .page { width: 210mm; height: 297mm; display: flex; justify-content: center; align-items: center; page-break-after: always; }
                .preview-img { width: 100%; height: 100%; object-fit: cover; }
            </style>
        </head>
        <body>
    `);

    const selectedImages = document.querySelectorAll("input[type='checkbox']:checked");
    const totalPartes = selectedImages.length;

    selectedImages.forEach((checkbox) => {
        const index = checkbox.value;
        const imgData = imagesData[index];

        // Si hay exactamente 2 partes, rotar la imagen
        let rotationStyle = "";
        if (totalPartes === 2) {
            rotationStyle = "transform: rotate(90deg); width: 297mm; height: 210mm;";
        } else {
            rotationStyle = "width: 210mm; height: 297mm;";
        }

        printWindow.document.write(`
            <div class="page">
                <img class="preview-img" src="${imgData.imageUrl}" style="${rotationStyle}">
            </div>
        `);
    });

    printWindow.document.write(`</body></html>`);
    printWindow.document.close();

    printWindow.onload = function () {
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };
}
