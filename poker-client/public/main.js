require('dotenv').config();

// const gateway = require('plain-poker-gateway');
// Dev
const gateway = require('D:\\Documents\\Fonyts\\Semester 6\\DPI\\Casus\\plain-poker-gateway');

const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const uuidv4 = require('uuid/v4');

const { app, BrowserWindow } = electron;

const sessionId = uuidv4();

const lobbyGateway = gateway.createLobbyGateway({
  websocket: {
    host: process.env.LOBBY_HOST,
    port: process.env.LOBBY_PORT,
  },
});
const tableGateway = gateway.createTableGateway({
  amqp: {
    host: process.env.RMQ_HOST,
    exchange: process.env.RMQ_EXCHANGE,
  },
});

let mainWindow;

/**
 * [createWindow description]
 */
function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
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

// lobbyGateway.onConnected(() => {
//     lobbyGateway.requestLobby().then((reply) => {
//         console.log(reply);
//         createTable({name: 'SuperTable123', minPlayerNo: 3, maxPlayerNo: 5,
//             minBet: 5, initialAmount: 55});
//     }).catch((err) => {
//         console.log(err);
//     });
// });

/**
 * [createTable description]
 * @param  {[type]} options [description]
 */
// function createTable(options) {
//     tableGateway.requestTableCreation(sessionId, options).then((reply) => {
//         console.log('create table reply received');
//         console.log(reply);
//     }).catch((err) => {
//         console.log(err);
//     });
// }
