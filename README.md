```markdown
# 🖼️ Divisor de Imágenes

Un sencillo divisor de imágenes que permite separar una imagen en partes utilizando diferentes modos (vertical, horizontal o grid). Permite configurar el formato y calidad de salida, además de previsualizar y descargar las imágenes resultantes.

## 🚀 Características

- 📂 **Carga de imágenes** desde tu dispositivo.
- 📏 **División en partes** verticales, horizontales o en cuadrícula.
- 🎨 **Ajuste de calidad y formato** de la imagen de salida (PNG, JPG, WEBP).
- 👀 **Vista previa** de las imágenes generadas antes de descargarlas.
- 💾 **Descarga de imágenes** individualmente o en grupo.

## 📁 Estructura del Proyecto

```

📂 Dividir-Imagenes
│── 📂 Estilos
│   ├── styles.css        # Estilos de la página principal
│   ├── stylesprev.css    # Estilos de la página de vista previa
│
│── 📂 logica
│   ├── aplicacion.js     # Lógica para dividir la imagen
│   ├── previsualizar.js  # Manejo de la vista previa y descargas
│
│── index.html            # Página principal para cargar y dividir imágenes
│── preview\.html          # Página para previsualizar y descargar imágenes
│── README.md             # Documentación del proyecto

````

## 📜 Uso

1. **Abrir `index.html` en el navegador**.
2. **Seleccionar una imagen** desde tu dispositivo.
3. **Elegir el modo de división**:
   - 🟰 **Vertical**: Divide la imagen en columnas.
   - 📏 **Horizontal**: Divide la imagen en filas.
   - 🔲 **Grid**: Divide en filas y columnas al mismo tiempo.
4. **Seleccionar el formato de salida** (PNG, JPG, WEBP).
5. **Ajustar la calidad** de la imagen (1 - 100).
6. **Hacer clic en "Dividir"** para procesar la imagen.
7. **Previsualizar los cortes** y seleccionar cuáles descargar en `preview.html`.

## 🛠️ Tecnologías utilizadas

- 🌐 **HTML, CSS, JavaScript** para la interfaz y funcionalidad.
- 🎨 **Canvas API** para procesar y dividir imágenes.
- 💾 **LocalStorage** para almacenar temporalmente las imágenes procesadas.

## 📌 Código Destacado

### 📌 Cargar y mostrar imagen en `canvas`
```js
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
````

### ✂️ Lógica para dividir la imagen

```js
function splitImage() {
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
            const dataURL = tempCanvas.toDataURL(`image/${format}`, quality);
            imagesData.push(dataURL);
        }
    }

    localStorage.setItem("splitImages", JSON.stringify(imagesData));
    window.location.href = "preview.html";
}
```

## 📌 Próximas mejoras

-

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

🖥️ Desarrollado con ❤️ por [Tu Nombre]

```
Elias Jeshua Salgado Coripuna

```
