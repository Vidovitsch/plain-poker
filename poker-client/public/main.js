require('dotenv').config();

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const uuidv4 = require('uuid/v4');
const LobbyHandler = require('./handlers/lobbyHandler');
const gatewayProvider = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway')({
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
  ws: {
    host: process.env.LOBBY_HOST,
    port: process.env.LOBBY_PORT,
  },
});

const sessionId = uuidv4();
let mainWindow;

// One connection with one channel for every action in lobby
gatewayProvider.createSharedChannelAsync('default', 'default').then(() => {
  const lobbyHandler = new LobbyHandler(gatewayProvider, ipcMain, sessionId);
  lobbyHandler.connectToLobbyAsync().then(() => {
    console.log('Connected with lobby');
    lobbyHandler.setHandlers();
  }).catch((err) => {
    console.log(err);
  });
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
      console.log(result);
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
  console.log(`Caught exception: ${err}`);
});
