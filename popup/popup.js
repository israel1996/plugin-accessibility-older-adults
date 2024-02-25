
// Función para limitar la frecuencia de ejecución de otra función 
function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

// Función que envia datos de la pestaña actual(activa) a background.js
function updateActiveTab(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0] && tabs[0].id && tabs[0].url.startsWith('http')) {
            chrome.tabs.sendMessage(tabs[0].id, msg);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const buttonSizeSlider = document.getElementById('buttonSizeSlider');
    const lineHeightSlider = document.getElementById('lineHeightSlider');
    const imageSizeSlider = document.getElementById('imageSizeSlider');
    const toggleContrastButton = document.getElementById('toggleContrast');
    const showImageAltText = document.getElementById('showImageAltText');

    const fontSizeValue = document.getElementById('fontSizeValue');
    const buttonSizeValue = document.getElementById('buttonSizeValue');
    const lineHeightValue = document.getElementById('lineHeightValue');
    const imageSizeValue = document.getElementById('imageSizeValue');


    // Carga las configuraciones del Storge a los controles deslizantes
    chrome.storage.sync.get(['fontSize', 'buttonSize', 'lineHeight', 'scaleFactor'], function (data) {
        if (data.fontSize) {
            fontSizeSlider.value = data.fontSize.replace('px', '');
            fontSizeValue.textContent = data.fontSize;
        }
        if (data.buttonSize) {
            buttonSizeSlider.value = data.buttonSize.replace('px', '');
            buttonSizeValue.textContent = data.buttonSize;
        }
        if (data.lineHeight) {
            lineHeightSlider.value = data.lineHeight;
            lineHeightValue.textContent = data.lineHeight;
        }
        if (data.scaleFactor) {
            imageSizeSlider.value = data.scaleFactor;
            imageSizeValue.textContent = data.scaleFactor;
        }

    });

    // Se guardan las configuraciones al Storage de los controles deslizantes
    fontSizeSlider.addEventListener('input', debounce(function () {
        const fontSize = fontSizeSlider.value + 'px';
        fontSizeValue.textContent = fontSize;
        chrome.storage.sync.set({ fontSize: fontSize });
        updateActiveTab({ action: "changeFontSize", fontSize: fontSize });
    }, 250));

    buttonSizeSlider.addEventListener('input', debounce(function () {
        const buttonSize = buttonSizeSlider.value + 'px';
        buttonSizeValue.textContent = buttonSize;
        chrome.storage.sync.set({ buttonSize: buttonSize });
        updateActiveTab({ action: "changeButtonSize", buttonSize: buttonSize });
    }, 250));

    lineHeightSlider.addEventListener('input', debounce(function () {
        const lineHeight = lineHeightSlider.value;
        lineHeightValue.textContent = lineHeight;
        chrome.storage.sync.set({ lineHeight: lineHeight });
        updateActiveTab({ action: "changeLineHeight", lineHeight: lineHeight });
    }, 250));

    // Suponiendo que el control deslizante de tamaño de imagen ahora representa un factor de escala
    imageSizeSlider.addEventListener('input', debounce(function () {
        const scaleFactor = imageSizeSlider.value; // Este valor es ahora un factor, no un tamaño fijo
        imageSizeValue.textContent = scaleFactor + 'x'; // Mostrar el factor de escala, como "1.5x"
        chrome.storage.sync.set({ scaleFactor: scaleFactor });
        updateActiveTab({ action: "changeImageSize", scaleFactor: scaleFactor });
    }, 250));

    // Manejador del botón de contraste
    toggleContrastButton.addEventListener('click', function() {
        updateActiveTab({ action: "toggleContrast" });
    });

    showImageAltText.addEventListener('click', function() {
        updateActiveTab({ action: "toggleImageAltText" });
    });
    


});

