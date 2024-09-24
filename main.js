import { app, BrowserWindow, ipcMain } from 'electron';
import { subscribeActiveWindow, unsubscribeActiveWindow, unsubscribeAllActiveWindow } from '@miniben90/x-win';
import { activeWindow } from '@miniben90/x-win';
// import {activeWindow} from 'get-windows';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the filename from the module URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name (equivalent to __dirname in CommonJS)
const __dirname = path.dirname(__filename);

app.disableHardwareAcceleration();

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '.', 'preload.js'),
    },
  });


  let lastWindow = null;
  let lastStartTime = null;

  const a = subscribeActiveWindow(activeWindow => {

      const window = activeWindow
      if (window) {
        // Update renderer process (index.html) with the current app info
        if (window.info.execName === 'Code'){
          mainWindow.webContents.send('updateTime', {
            name: window.info.execName,
            timeSpent: 1 // in seconds
          });
        } else {
          mainWindow.webContents.send('updateTime', {
            name: window.info.execName,
            timeSpent: 0
          })
        }
        //console.log(window.owner)
      }
  
    
  
    console.log('test a', activeWindow.info.execName);
  });

  /* setInterval(() => {
    const window = activeWindow()

    if (window) {
      // Update renderer process (index.html) with the current app info
      if (window.info.execName === 'Code'){
        mainWindow.webContents.send('updateTime', {
          name: window.info.execName,
          timeSpent: 1 // in seconds
        });
      } else {
        mainWindow.webContents.send('updateTime', {
          name: window.info.execName,
          timeSpent: 0
        })
      }
      //console.log(window.owner)
    }

  }, 1000)
*/
  
  mainWindow.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
