document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.button');
  const circle = document.querySelector('.circle');
  const dark = document.querySelector('#dark');
  const light = document.querySelector('#light');

  async function getCurrentTabID() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0].id);
      });
    });
  }

  function saveDarkModePreference(tabID, enabled) {
    chrome.storage.sync.set({ [`darkMode_${tabID}`]: enabled });
  }

  function loadDarkModePreference(tabID, callback) {
    chrome.storage.sync.get([`darkMode_${tabID}`], (result) => {
      callback(result[`darkMode_${tabID}`]);
    });
  }

  function setButtonState(enabled) {
    if (enabled) {
      dark.style.visibility = 'visible';
      light.style.visibility = 'hidden';
      circle.style.animation = 'moveCircleRight 0.5s forwards';
      button.style.animation = 'backgroundPurple 0.5s forwards';
    } else {
      light.style.visibility = 'visible';
      dark.style.visibility = 'hidden';
      circle.style.animation = 'moveCircleLeft 0.5s forwards';
      button.style.animation = 'backgroundBlue 0.5s forwards';
    }
  }

  async function initialize() {
    const tabID = await getCurrentTabID();

    loadDarkModePreference(tabID, (enabled) => {
      setButtonState(enabled);
    });

    button.addEventListener('click', () => {
      loadDarkModePreference(tabID, (enabled) => {
        const newEnabled = !enabled;

        saveDarkModePreference(tabID, newEnabled);
        setButtonState(newEnabled);

        chrome.tabs.sendMessage(tabID, {
          action: newEnabled ? 'enableDarkMode' : 'disableDarkMode',
        });
      });
    });
  }

  initialize();
});
