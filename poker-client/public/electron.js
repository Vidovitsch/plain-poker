'use strict'

require('dotenv').config();

const gateway = require('plain-poker-gateway');
const electron = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const { app, BrowserWindow, ipcMain} = electron;
const lobbyGateway = gateway.createLobbyGateway({
    websocket: {
        host: process.env.LOBBY_HOST,
        port: process.env.LOBBY_PORT,
    }
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 900, height: 680});
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

lobbyGateway.onConnected(data => {
    console.log(data);
});
