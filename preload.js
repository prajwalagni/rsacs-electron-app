const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('quit'),
  //openFile: () => ipcRenderer.invoke('dialog:openFile')
})


