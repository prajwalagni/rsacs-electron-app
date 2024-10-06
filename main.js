const { app, BrowserWindow, ipcMain, ipcRenderer, dialog, Menu, MenuItem, Tray, nativeImage } = require('electron');
const path = require('path');
let tray = null;
let win = null;
const trayIcon = nativeImage.createFromPath('favicon/favicon-48x48.png');
const appIcon = nativeImage.createFromPath('favicon/web-app-manifest-192x192.png');

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

function createWindow() {
  // Create the browser window
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'), // Load preload script
        contextIsolation: true,  // Keep context isolation for security
        enableRemoteModule: true, // No direct access to Node.js modules
        nodeIntegration: false // Don't allow full Node.js in renderer
    },
    icon: appIcon
  })

  ipcMain.on('quit', (event) => {
    app.quit()
  })

  // const menu = new Menu()
  // menu.append(new MenuItem({
  //   label: 'Electron',
  //   submenu: [{
  //     role: 'help',
  //     accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
  //     click: () => win.webContents.send('help')
  //   },
  //   {
  //     role: 'quit',
  //     accelerator: process.platform === 'darwin' ? 'Alt+Q' : 'Ctrl+Q',
  //     click: () => app.quit()
  //   },
  //   {
  //     role: 'devTools',
  //     accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+I' : 'Ctrl+Shift+I',
  //     click: () => win.webContents.openDevTools()
  //   }]
  // }))
  // menu.append(new MenuItem({
  //   label: 'Counter',
  //   submenu: [
  //     {
  //       click: () => win.webContents.send('update-counter', 1),
  //       label: 'Increment'
  //     },
  //     {
  //       click: () => win.webContents.send('update-counter', -1),
  //       label: 'Decrement'
  //     }
  //   ]
  // }))

  // Menu.setApplicationMenu(menu)

  // Create a system tray icon
  tray = new Tray(trayIcon);
  tray.setToolTip('My Electron Test App');

  // Handle closing to tray
  win.on('close', (event) => {
    event.preventDefault();
    win.hide();
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        win.show();
      },
    },
    {
      label: 'Settings',
      click: () => {
        // Code to open a settings window
      },
    },
    {
      type: 'separator', // Add a line separator in the menu
    },
    {
      label: 'Help',
      click: () => {
        // Open a help page or modal
      },
    },
    {
      label: 'Quit',
      click: () => {
        win.destroy();
      },
    },
  ]);

  // Set the context menu to the tray
  tray.setContextMenu(contextMenu);

  // Set the tray icon's tooltip (optional)
  tray.setToolTip('My Electron App');

  // Optionally, you can handle left-click events as well (e.g., to show the main window)
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide();  // Minimize to tray
    } else {
      win.show();  // Show the window when clicked
    }
  });

  // Load the index.html of the app
  win.loadFile('index.html')
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    //ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow()
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Handle the version request from the renderer process
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});