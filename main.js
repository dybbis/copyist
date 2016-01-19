const app       = require('app');
const electron  = require('electron');
const express   = require('express');
const Window    = electron.BrowserWindow;
const Menu      = electron.Menu;
const Tray      = electron.Tray;

require('crash-reporter').start();

var window          = null;
var appIcon         = null;
var homeFolder      = process.env.USERPROFILE || process.env.HOME;
var configFolder    = homeFolder + "/.config/cmd";

require('./setup.js')(configFolder);

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {

    appIcon = new Tray( __dirname + '/assets/images/tray.png');

    var contextMenu = Menu.buildFromTemplate([
        { label: 'Preferences', click: function() { require('electron').shell.openExternal('http://electron.atom.io') } },
        { label: 'About', click: function() { require('electron').shell.openExternal('http://electron.atom.io') } },
        { type: 'separator' },
        { label: 'Exit', click: function() { process.exit(0); } }
    ]);

    appIcon.setToolTip('This is my application.');
    appIcon.setContextMenu(contextMenu);

    window = new Window({
        //'skip-taskbar': true,
        'resizable': false,
        'frame': false,
        'transparent': true,
        'width': 800,
        'height': 700
    });

    window.loadURL('file://' + __dirname + '/index.html');

    window.webContents.openDevTools();

    window.on('closed', function() {
        window = null;
    });
});

require('./routes.js')(configFolder);

