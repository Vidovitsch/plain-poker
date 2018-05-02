require('dotenv').config();

const { app, BrowserWindow, ipcMain } = require('electron');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway');
const path = require('path');
const isDev = require('electron-is-dev');
const uuidv4 = require('uuid/v4');
const LobbyHandler = require('./handlers/lobbyHandler');

const sessionId = uuidv4();
let mainWindow;

const lobbyHandler = new LobbyHandler(sessionId, gatewayProvider, ipcMain);
lobbyHandler.connectToLobby().then(() => {
  lobbyHandler.startHandlers();
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
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
