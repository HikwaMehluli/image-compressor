
/*!
 * Image Compressor v1.0.2
 * https://github.com/HikwaMehluli/image-compressor
 *
 * Copyright (c) 2018-2020 HikwaMehluli
 * Released under the MIT license
 *
 */
const { app, BrowserWindow, Menu} = require('electron')

const shell = require('electron').shell

let win

function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
    
    win.on('closed', () => {
        win = null
    })

    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label:'Author',
                    click() { 
                        shell.openExternal('https://thatafro.netlify.app/')
                    } 
                },
                {type:'separator'},
                {
                    label:'Exit', 
                    click() { 
                        app.quit() 
                    } 
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu); 
}

// This method will be called when Electron has finished initialization and is ready to create browser windows. Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})