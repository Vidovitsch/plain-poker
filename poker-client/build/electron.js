require('dotenv').config();
const logger = require('./util/logger');
const gatewayConfig = require('./util/gatewayConfig');
const gatewayProvider = require('plain-poker-gateway')(gatewayConfig);
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const uuidv4 = require('uuid/v4');
const HandlerSwitch = require('./util/handlerSwitch');

// in-memory session
const sessionId = uuidv4();

let mainWindow;

// Start
HandlerSwitch.getInstance({
  sessionId,
  gatewayProvider,
  ipcMain,
  connectionKey: 'default',
  channelKey: 'default',
}).initLobby();

/**
 * [createWindow description]
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
  });
  mainWindow.setResizable(false);
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => { mainWindow = null; });

  ipcMain.on('close-main-window', () => {
    app.quit();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    const result = gatewayProvider.closeSharedConnection();
    if (result instanceof Error) {
      logger.error(result);
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

process.on('uncaughtException', (err) => {
  logger.info(`Uncaught exception: ${err}`);
});
