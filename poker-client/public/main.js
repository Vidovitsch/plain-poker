require('dotenv').config();
const logger = require('./util/logger');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const uuidv4 = require('uuid/v4');
const LobbyHandler = require('./handlers/lobbyHandler');
const gatewayConfig = require('./util/gatewayConfig');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')(gatewayConfig);

// in-memory session
const sessionId = uuidv4();

let mainWindow;

// One connection with one channel for every action in lobby
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const lobbyHandler = LobbyHandler.getInstance(sessionId);
  if (lobbyHandler.start(gatewayProvider, ipcMain)) {
    logger.info(`Client services started successfully => 127.0.0.1:${process.env.PORT}`);
    lobbyHandler.connectToLobbyAsync().then(() => {
      logger.info('Client has successfully connected with the lobby');
    }).catch((err) => {
      logger.error(err);
    });
  }
});

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
  logger.infor(`Uncaught exception: ${err}`);
});
