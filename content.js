// Function to click on the last element
function clickOnLastElement() {
  const elements = document.querySelectorAll(
    ".lrn-path-cont.permission_public.prerequisite-cont.lrn-path-con-selected"
  );

  if (elements.length > 0) {
    const lastElement = elements[elements.length - 1];
    lastElement.click();
  }
}

// Function to scroll to the last completion path element
function scrollToLastElement() {
  const elements = document.querySelectorAll(
    ".lrn-path-completion-circle.clr1-text.completed"
  );
  if (elements.length > 0) {
    const lastElement = elements[elements.length - 2]; // Change to -1 to select the last element
    lastElement.scrollIntoView({ behavior: "smooth" });
  }
}

clickOnLastElement();
setTimeout(scrollToLastElement, 5000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enableDarkMode") {
    enableDarkMode()
      .then(() => {
        const domain = new URL(window.location.href).hostname;
        chrome.storage.sync.set({ [`darkMode_${domain}`]: true });
        sendResponse({ status: "dark mode enabled" });
      })
      .catch((error) => {
        sendResponse({ status: "error", message: error.message });
      });
  } else if (request.action === "disableDarkMode") {
    disableDarkMode()
      .then(() => {
        const domain = new URL(window.location.href).hostname;
        chrome.storage.sync.set({ [`darkMode_${domain}`]: false });
        sendResponse({ status: "dark mode disabled" });
      })
      .catch((error) => {
        sendResponse({ status: "error", message: error.message });
      });
  }
  return true;
});

function enableDarkMode() {
  return new Promise((resolve, reject) => {
    try {
      DarkReader.setFetchMethod(window.fetch);
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function disableDarkMode() {
  return new Promise((resolve, reject) => {
    try {
      DarkReader.setFetchMethod(window.fetch);
      DarkReader.disable();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

window.addEventListener("load", () => {
  const domain = new URL(window.location.href).hostname;
  chrome.storage.sync.get([`darkMode_${domain}`], (result) => {
    const darkModeEnabled = result[`darkMode_${domain}`];
    if (darkModeEnabled) {
      enableDarkMode();
    }
  });
});
