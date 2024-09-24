const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  updateTime: (callback) => ipcRenderer.on('updateTime', (event, value) => callback(value)), // Allow receiving specific events
})