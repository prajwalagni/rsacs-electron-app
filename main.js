const { app, BrowserWindow, ipcMain, ipcRenderer, dialog, Menu, MenuItem, Tray, nativeImage } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
let tray = null;
let win = null;
const trayIcon = nativeImage.createFromPath('favicon/favicon-48x48.png');
const appIcon = nativeImage.createFromPath('favicon/web-app-manifest-192x192.png');
const mysql = require('mysql2');
const TGBot = require('node-telegram-bot-api');
const cron = require('node-cron');

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
        nodeIntegration: true // Don't allow full Node.js in renderer
    },
    icon: appIcon
  })

  win.maximize();

  ipcMain.on('quit', (event) => {
    app.quit()
  })

  ipcMain.on('sendNotification', (event, title, body) => {
    socket.emit('send-notification', { title, body });
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
        connection.end();
        win.destroy();
      },
    },
  ]);

  // Set the context menu to the tray
  tray.setContextMenu(contextMenu);

  // Set the tray icon's tooltip (optional)
  tray.setToolTip('RSACS Software');

  // Optionally, you can handle left-click events as well (e.g., to show the main window)
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide();  // Minimize to tray
    } else {
      win.show();  // Show the window when clicked
    }
  });

  // Load the index.html of the app
  win.loadFile('newDesign/index.html')
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    //ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
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

// Create the connection to the database
const connection = mysql.createConnection({
  host: '192.168.0.221', // Replace with the IP address of the MySQL server
  user: 'prajwal',
  password: 'Prajwal!16',
  database: 'rsacs_db'
});

// Test the connection
connection.connect((err) => {
  if (err) {
    return console.error('error connecting: ' + err.stack);
  }
  console.log('connected as id ' + connection.threadId);
});

ipcMain.handle('cal-details-sql-data', async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM cal_details ORDER BY sl_no', (err, results, fields) => {
      if (err) {
        reject(err);  // Handle the error
      } else {
        // console.log(results);  // This will now log the correct results
        resolve(results);      // Return the results when the query completes
      }
    });
  });
});

ipcMain.handle('cal-entry', (event, sl_no, eqp_name, cust_name, city, eqp_sl_no, cal_std, cal_date, cal_due_date) => {

  console.log(sl_no, eqp_name, cust_name, city, eqp_sl_no, cal_std, cal_date, cal_due_date);
  
  return new Promise((resolve, reject) => {
    connection.execute('INSERT cal_details (sl_no, eqp_name, cust_name, city, eqp_sl_no, cal_std, cal_date, cal_due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [sl_no, eqp_name, cust_name, city, eqp_sl_no, cal_std, cal_date, cal_due_date], (err, results) => {
      if (err) {
        throw err;
        reject(err);  // Handle the error
      } else {
        console.log('Inserted ID:', results);
        resolve(results);      // Return the results when the query completes
      }
    });
  });
  
});

ipcMain.handle('cal-rm-entry', (event, sl_no) => {

  console.log("RM: ", sl_no);
  
  return new Promise((resolve, reject) => {
    connection.execute('DELETE FROM cal_details WHERE sl_no = ?', [sl_no], (err, results) => {
      if (err) {
        throw err;
        reject(err);  // Handle the error
      } else {
        console.log('Removed ID:', results);
        resolve(results);      // Return the results when the query completes
      }
    });
  });
  
});

const botToken = '1164104361:AAFD5t5u_iJISiKz58hJHav7rv8uhbyj0xk';  // Replace with your bot token
const chatId = '-1001172413614'; //'469130264' // Replace with the chat ID where you want to send the message

// Create a new instance of the bot
const bot = new TGBot(botToken, { polling: false });

async function sendTGmsg(message) {
  bot.sendMessage(chatId, message, { parse_mode: 'HTML' })
    .then(() => {
      console.log('Message sent successfully');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
}

ipcMain.handle('send-telegram-message', (event, message) => {
  sendTGmsg(message);
});


// Daily check at 3 AM
cron.schedule('0 3 * * *', async () => {
  // console.log("cron running");
  connection.query('SELECT * FROM cal_details ORDER BY sl_no', async function (err, results, fields) {
    if (err) throw err;
    // console.log("res DONE");
    for (let n = 0; n < results.length; n++) {
      // console.log("loop", n);
      let date1 = new Date();
      let date2 = results[n].cal_due_date;

      const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
      const diffDays = Math.ceil((date2 - date1) / oneDay);
      // console.log(results[n].sl_no, "diff: ", diffDays);

      if (diffDays == 15 || diffDays == 7) {
          let message = `
              <b>ONLY ${diffDays} DAYS REMAINING !!</b>

  <b>Sl.No:</b>   ${results[n].sl_no}
  <b>Equipment Name:</b>   ${results[n].eqp_name}
  <b>Company Name:</b>   ${results[n].cust_name}
  <b>City:</b>   ${results[n].city}
  <b>Equipment Sl.No:</b>   ${results[n].eqp_sl_no}
  <b>Calibration Standard:</b>   ${results[n].cal_std}
  <b>Calibration Date:</b>   ${results[n].cal_date.toISOString().split('T')[0]}
  <b>Calibration Due Date:</b>   ${results[n].cal_due_date.toISOString().split('T')[0]}
          `
          // let res = await win.webContents.send('send_tg_msg', message);
          // console.log(win.webContents.send('send_tg_msg', message));
          // ipcRenderer.invoke('send-telegram-message', msg);
          sendTGmsg(message);
      }
      
    }
  });
});

// Monthly check on the 1st of every month at 3 AM
cron.schedule('0 3 28 * *', async () => {
  // console.log("cron running");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  connection.query('SELECT * FROM cal_details ORDER BY cal_due_date', async function (err, results, fields) {
    if (err) throw err;
    // console.log("res DONE");
    setTimeout(async () => {
      for (let n = 0; n < results.length; n++) {
        // console.log("loop", n);
        let today = new Date();
        let year1 = today.getFullYear();
        let date1 = today.getMonth() + 2;
        let year2 = results[n].cal_due_date.getFullYear();
        let date2 = results[n].cal_due_date.getMonth() + 1;
        // console.log(year, date1, date2);
  
        // const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
        // const diffDays = Math.ceil((date2 - date1) / oneDay);
        // console.log(results[n].sl_no, "diff: ", diffDays);
  
        if (date1 == date2 && year1 == year2) {
          // console.log(year1, date1, year2, date2);
          let message = `
              <b>NEXT MONTH (${months[date1 - 1]}) CALIBRATION DUES !!</b>
  
  <b>Sl.No:</b>   ${results[n].sl_no}
  <b>Equipment Name:</b>   ${results[n].eqp_name}
  <b>Company Name:</b>   ${results[n].cust_name}
  <b>City:</b>   ${results[n].city}
  <b>Equipment Sl.No:</b>   ${results[n].eqp_sl_no}
  <b>Calibration Standard:</b>   ${results[n].cal_std}
  <b>Calibration Date:</b>   ${results[n].cal_date.toISOString().split('T')[0]}
  <b>Calibration Due Date:</b>   ${results[n].cal_due_date.toISOString().split('T')[0]}
          `
          // let res = await win.webContents.send('send_tg_msg', message);
          // console.log(win.webContents.send('send_tg_msg', message));
          // ipcRenderer.invoke('send-telegram-message', msg);
          // setTimeout(() => {
          //   sendTGmsg(message);
          // }, 1500);
          await sendTGmsg(message);
        }
        
      }
    }, 1000);
    
  });
});

// // Monthly check on the 1st of every month at 3 AM
// cron.schedule('0 3 1 * *', async () => {
//   await win.webContents.send('sendTelegramMessage');
// });

// Query the database (example)
// connection.query('SELECT * FROM cal_details', function (err, results, fields) {
//   if (err) throw err;
//   // console.log(results); // Logs the rows returned by the query
//   // console.log(upcCalsres);
// });

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})