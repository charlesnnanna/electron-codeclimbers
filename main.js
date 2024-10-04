import { app, BrowserWindow, ipcMain } from 'electron';
import { subscribeActiveWindow} from '@miniben90/x-win';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the filename from the module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetApps = ['Games', 'Google Chrome', 'Mail'].join(',')


async function executeScript (){
  try {
    const command = `osascript toggle-notification.scpt "${targetApps}"`;
    await exec(command)
    console.log(`AppleScript Output: ${targetApps}`);
  } catch (error) {
    console.log(error)
  }
}

 async function toggleDoNotDisturb(event, data) { 

  const result = {}
  try {
    if (data === 'On'){
      await executeScript()
      result.status = false
      result.text = 'Off'
    } 
    if (data === 'Off') {
      await executeScript()
      result.status = true
      result.text = 'On'
    }
  }
   catch (error) {
    console.log(error.message)
  }
  return result
  }

app.disableHardwareAcceleration();

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '.', 'preload.js'),
    },
  });

subscribeActiveWindow(activeWindow => {
      const window = activeWindow
      if (window) {
          mainWindow.webContents.send('updateTime', {
            name: window.info.execName,
          });
      }
  });

  mainWindow.loadFile('index.html');
};

app.whenReady().then(() => {
  ipcMain.handle('toggleDnd', toggleDoNotDisturb)
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


