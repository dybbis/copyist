const fs        = require('fs');
const app       = require('app');
const electron  = require('electron');
const Window    = electron.BrowserWindow;
const Menu      = electron.Menu;
const Tray      = electron.Tray;

require('crash-reporter').start();

var window          = null;
var appIcon         = null;
var homeFolder      = process.env.USERPROFILE || process.env.HOME;
var configFolder    = homeFolder + "/.config/cmd";
var keybindings     = configFolder + "/keybindings.json";

try {
    fs.accessSync(configFolder, fs.F_OK);
    fs.accessSync(keybindings, fs.F_OK);
} catch (e) {
    switch(e.path) {
        case configFolder:
            fs.mkdirSync(configFolder);
        case keybindings:
            fs.createReadStream('./default-keybindings.json').pipe(fs.createWriteStream(keybindings));
            break;
    }
}

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
        'frame': true,
        'transparent': true
    });

    window.loadURL('file://' + __dirname + '/index.html');

    window.webContents.openDevTools();

    window.on('closed', function() {
        window = null;
    });
});

// Load config files in angularjs

var http = require('http');

//We need a function which handles requests and send response
function handleRequest(request, response) {
    console.log();
    switch(request.url) {
        case "/keybindings":
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify(require(keybindings)));
            break;
        case "/keynames":
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify(require("./keynames.json")));
            break;
        default:
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.end("404 Not found");
            break;
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(13765, function(){});
