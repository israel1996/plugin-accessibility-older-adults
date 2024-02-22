
// Función para cambiar el tamaño de fuente en la página web
function changeFontSize(fontSize) {
    const textElements = ['p', 'span', 'a', 'div', 'li', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'input', 'label', 'textarea'];

    textElements.forEach(function (tag) {
        document.querySelectorAll(tag).forEach(function (element) {
            element.style.fontSize = fontSize;
        });
    });
}

// Función para cambiar el tamaño de los elementos que funcionan como botones en la página web
function changeButtonSize(buttonSize) {
    const buttonSelectors = [
        'button',
        '[role="button"]',
        'a[href]',
        '.btn',
        '.button',
        'span[onclick]',
        'div[onclick]',
        'a[role="button"]'
    ];

    document.querySelectorAll(buttonSelectors.join(', ')).forEach(function (element) {
        element.style.padding = buttonSize;
    });
}

// Función para cambiar el interlineado del texto en la página web
function changeLineHeight(lineHeight) {
    document.querySelectorAll('body, body *').forEach(function (element) {
        element.style.lineHeight = lineHeight;
    });
}

// Escuchar mensajes del popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "changeFontSize") {
        changeFontSize(request.fontSize);
    } else if (request.action === "changeButtonSize") {
        changeButtonSize(request.buttonSize);
    } else if (request.action === "changeLineHeight") {
        changeLineHeight(request.lineHeight);
    }
});

//Escuchar mensajes del background.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "changeFontSize") {
        sendResponse({ result: "Tamaño de fuente aplicado" });
    }else if (request.action === "changeButtonSize") {
        sendResponse({ result: "Tamaño de botón aplicado" });
    } else if (request.action === "changeLineHeight") {
        sendResponse({ result: "Interlineado aplicado" });
    }
    return true;
});
