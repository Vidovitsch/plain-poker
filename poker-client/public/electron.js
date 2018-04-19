'use strict'

require('dotenv').config();

const electron = require('electron');
const amqp = require('amqplib/callback_api');
const socket = require('socket.io-client')('http://' + process.env.LOBBY_HOST + ':' + process.env.LOBBY_PORT);
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const { app, BrowserWindow, ipcMain } = electron;

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

socket.on('connect', () => {
    socket.on('init-lobby', (data) => {
        console.log
    });
})

amqp.connect('amqp://' + process.env.RMQ_HOST, (err, conn) => {
    conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer('Hello World!'));
    console.log(" [x] Sent 'Hello World!'");
  });
});
