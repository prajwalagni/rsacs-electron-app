const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('quit'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  //openFile: () => ipcRenderer.invoke('dialog:openFile')
})


