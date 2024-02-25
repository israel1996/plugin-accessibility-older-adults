// Función para cambiar el tamaño de fuente en la página web
function changeFontSize(fontSize) {
    const textElements = ['p', 'span', 'a', 'div', 'li', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'input', 'label', 'textarea'];
    textElements.forEach(tag => {
        document.querySelectorAll(tag).forEach(element => {
            element.style.fontSize = fontSize;
        });
    });
}

// Función para cambiar el tamaño de los elementos que funcionan como botones en la página web
function changeButtonSize(buttonSize) {
    const buttonSelectors = ['button', '[role="button"]', 'a[href]', '.btn', '.button', 'span[onclick]', 'div[onclick]', 'a[role="button"]'];
    document.querySelectorAll(buttonSelectors.join(', ')).forEach(element => {
        element.style.padding = buttonSize;
    });
}

// Función para cambiar el interlineado del texto en la página web
function changeLineHeight(lineHeight) {
    document.querySelectorAll('body, body *').forEach(element => {
        element.style.lineHeight = lineHeight;
    });
}

// Objeto para almacenar el tamaño original de las imágenes y videos
const originalImageSizes = {};

function storeOriginalImageSizes() {
    const elements = document.querySelectorAll('img, video');
    elements.forEach((elem, index) => {
        const isVideo = elem.tagName.toLowerCase() === 'video';
        const key = `${isVideo ? 'video' : 'img'}-${index}-${elem.src || elem.currentSrc || index}`;
        if (!originalImageSizes[key]) {
            originalImageSizes[key] = {
                width: elem.offsetWidth,
                height: elem.offsetHeight
            };
        }
    });
}


// Función para cambiar el tamaño de imágenes y videos de una página web proporcionalmente
function changeImageSize(scaleFactor) {
    const elements = document.querySelectorAll('img, video');
    elements.forEach((elem, index) => {
        const isVideo = elem.tagName.toLowerCase() === 'video';
        const key = `${isVideo ? 'video' : 'img'}-${index}-${elem.src || elem.currentSrc || index}`;
        const originalSize = originalImageSizes[key];
        if (originalSize) {
            const newWidth = originalSize.width * scaleFactor;
            const newHeight = originalSize.height * scaleFactor;
            elem.style.width = `${newWidth}px`;
            elem.style.height = `${newHeight}px`;
            // Para videos, asegurar que el contenedor del video se ajuste también
            if (isVideo && elem.parentElement) {
                elem.parentElement.style.width = `${newWidth}px`;
                elem.parentElement.style.height = `${newHeight}px`;
            }
        }
    });
}

// Función para alternar el contraste de la página
function toggleContrast() {
    document.body.classList.toggle('high-contrast');
}

// Añadir estilos de alto contraste
const style = document.createElement('style');
style.innerHTML = `
.high-contrast {
    filter: invert(100%);
    background-color: black !important;
}
.high-contrast img, .high-contrast video {
    filter: invert(100%) !important;
}`;
document.head.appendChild(style);


// Aplica todas las configuraciones guardadas
function applyAllSettings() {
    chrome.storage.sync.get(['fontSize', 'buttonSize', 'lineHeight', 'scaleFactor'], data => {
        if (data.fontSize) {
            changeFontSize(data.fontSize);
        }
        if (data.buttonSize) {
            changeButtonSize(data.buttonSize);
        }
        if (data.lineHeight) {
            changeLineHeight(data.lineHeight);
        }
        if (data.scaleFactor) {
            changeImageSize(Number(data.scaleFactor));
        }
    });
}

// Observa cambios en el DOM y reaplica las configuraciones
const observer = new MutationObserver(mutations => {
    applyAllSettings();
    storeOriginalImageSizes(); // Vuelve a almacenar tamaños originales por si se agregaron nuevas imágenes
});

observer.observe(document.body, { childList: true, subtree: true });

// Escuchar mensajes del popup.js y background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "changeFontSize") {
        changeFontSize(request.fontSize);
    } else if (request.action === "changeButtonSize") {
        changeButtonSize(request.buttonSize);
    } else if (request.action === "changeLineHeight") {
        changeLineHeight(request.lineHeight);
    } else if (request.action === "changeImageSize") {
        changeImageSize(Number(request.scaleFactor));
    } else if (request.action === "toggleContrast") {
        toggleContrast();
    }

    // Reaplicar todas las configuraciones para asegurar coherencia
    applyAllSettings();
    sendResponse({ result: "Configuración aplicada" });
    return true;
});

// Almacenar los tamaños originales de las imágenes al cargar la página
window.onload = () => {
    storeOriginalImageSizes();
    applyAllSettings(); // Asegura que las configuraciones se apliquen al cargar la página
};
