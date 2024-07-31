chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enableDarkMode") {
    sendMessageToContentScript(request, sendResponse);
  } else if (request.action === "disableDarkMode") {
    sendMessageToContentScript(request, sendResponse);
  } else {
    sendResponse({ status: "unknown action" });
  }
  return true;
});

function sendMessageToContentScript(request, sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      sendResponse({ status: "error", message: "No active tabs found" });
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
      if (chrome.runtime.lastError) {
        sendResponse({
          status: "error",
          message: chrome.runtime.lastError.message,
        });
      } else {
        sendResponse(response);
      }
    });
  });
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    applyDarkModeFromStorage(tabId);
  }
});

// Listen for new tab creations
chrome.tabs.onCreated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    applyDarkModeFromStorage(tabId);
  }
});

function applyDarkModeFromStorage(tabId) {
  chrome.storage.sync.get([`darkMode_${tabId}`], (result) => {
    const darkModeEnabled = result[`darkMode_${tabId}`];
    console.log(darkModeEnabled);
    if (darkModeEnabled) {
      chrome.tabs.sendMessage(tabId, { action: "enableDarkMode" });
    } else {
      chrome.tabs.sendMessage(tabId, { action: "disableDarkMode" });
    }
  });
}
