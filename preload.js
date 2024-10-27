const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('quit'),
  sendNotification: (title, body) => ipcRenderer.send('sendNotification', title, body),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  //openFile: () => ipcRenderer.invoke('dialog:openFile')
  cal_entry: (sl_no, eqp_name, cust_name, city, eqp_sl_no, cal_std, cal_date, cal_due_date) => ipcRenderer.invoke('cal-entry', sl_no, eqp_name, cust_name, city, eqp_sl_no, cal_std, cal_date, cal_due_date),
  cal_rm_entry: (sl_no) => ipcRenderer.invoke('cal-rm-entry', sl_no),
  get_cal_details_sqldata: () => ipcRenderer.invoke('cal-details-sql-data'),
  send_tg_msg: (msg) => ipcRenderer.invoke('send-telegram-message', msg),
  // sendTelegramMessage: () => ipcRenderer.invoke('send-telegram-message')
});


