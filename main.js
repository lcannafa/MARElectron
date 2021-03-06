const electron = require('electron');
const { ipcMain } = require('electron');
const axios = require('axios')

// Module to control application life.
const app = electron.app;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the windows object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadFile('index.html')


    // Attach event listener in order to get the style of graphics the user requires
    ipcMain.on('confirm', (event, arg) => {
        var tipodeInforme;
        var urlreporte
        tipodeInforme = JSON.stringify(arg);

 
        if(tipodeInforme == "1"){
        axios.get('http://machinear.dis.eafit.edu.co/1')
        .then(res => {
        urlreporte = JSON.stringify(res.data.link);
        console.log(urlreporte);
        mainWindow.webContents.send('link', urlreporte);
        });
        }

       if(tipodeInforme == "0"){    
        axios.get('http://machinear.dis.eafit.edu.co/0')
        .then(res => {
        urlreporte = JSON.stringify(res.data.link);
        console.log(urlreporte);
        mainWindow.webContents.send('link', urlreporte);
        });
        }
     });



    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;

    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// pone un ciclo para ejecutar el llamado
app.on('ready', function() {
    setInterval(function(){
        axios.get('https://machinear-node.herokuapp.com/api/variables')
        .then(res => {
        mainWindow.webContents.send('volt', res.data.voltaje);
        mainWindow.webContents.send('corriente', res.data.corriente);
        mainWindow.webContents.send('y', res.data.y);
        mainWindow.webContents.send('x', res.data.x);
        });
    }, 500);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})