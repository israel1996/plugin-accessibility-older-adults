
//Se ejecuta cuando se cambia de pestaña
chrome.tabs.onActivated.addListener(function(activeInfo) {
    applySettingsToTab(activeInfo.tabId);
});

//Se ejecuta cuando se recarga la página
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        applySettingsToTab(tabId);
    }
});


function applySettingsToTab(tabId) {
    chrome.tabs.get(tabId, function(tab) {
        if (tab && tab.url && tab.url.startsWith('http')) {
            chrome.storage.sync.get(['fontSize'], function(data) {
                if (data.fontSize) {
                    sendMessageToTab(tab.id, { action: "changeFontSize", fontSize: data.fontSize });
                }
                if (data.buttonSize) {
                    sendMessageToTab(tab.id, { action: "changeButtonSize", buttonSize: data.buttonSize });
                }
                if (data.lineHeight) {
                    sendMessageToTab(tab.id, { action: "changeLineHeight", lineHeight: data.lineHeight });
                }
            });
        }
    });
}

//Envia las configuraciones guardadas para actualizar los sliders.
function sendMessageToTab(tabId, data) {
    chrome.tabs.sendMessage(tabId, data, function(response) {
        if (chrome.runtime.lastError) {
            console.log("Error al enviar mensaje: ", chrome.runtime.lastError.message);
        }
    });
}
