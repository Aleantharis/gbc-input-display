// Import the necessary Electron modules
const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;

// Exposed protected methods in the render process
contextBridge.exposeInMainWorld(
  // Allowed 'ipcRenderer' methods
  'bridge', {
  // From main to render
  sendCfgs: (message) => {
    ipcRenderer.on('sendCfgs', message);
  }
}
);