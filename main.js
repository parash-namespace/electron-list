const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// production
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// listen app to be ready
app.on('ready', function(){
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile('mainWindow.html')

  mainWindow.on('closed', function(){
    app.quit();
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// Handle Add Window
function createAddWindow(){
  addWindow = new BrowserWindow({
    height: 200,
    width: 300,
    title: "Add Shopping Item.",
    webPreferences: {
      nodeIntegration: true
    }
  });
  addWindow.loadFile('addWindow.html')

  // Garbage Collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// catch Item
ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
});

// Menu Template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click(){
          createAddWindow();
        }
      },{
        label: 'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },{
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// For Mac
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// If not in production, show developer options
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'Reload'
      }
    ]
  });
}
