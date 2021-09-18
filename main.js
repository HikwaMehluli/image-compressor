/*!
 * Image Compressor v1.0.2
 * https://github.com/HikwaMehluli/image-compressor
 *
 * Copyright (c) 2018-2020 HikwaMehluli
 * Released under the MIT license
 *
 */

//handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   // squirrel event handled and app will exit in 1000ms, so don't do anything else
   return;
}

// const electron = require('electron')
// // Module to control application life.
// const app = electron.app
// const {ipcMain} = require('electron')
// var path = require('path')




// Module to create native browser window.
const { theapp, BrowserWindow, Menu} = require('electron')

const shell = require('electron').shell

let windowForBrowser

function createWindow() {
    windowForBrowser = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })

    windowForBrowser.loadFile('index.html')
    
    windowForBrowser.on('closed', () => {
        windowForBrowser = null
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
                        theapp.quit() 
                    } 
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu); 
}

// This method will be called when Electron has finished initialization and is ready to create browser windows. Some APIs can only be used after this event occurs.
theapp.on('ready', createWindow)

// Quit when all windows are closed.
theapp.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        theapp.quit()
    }
})

theapp.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if (windowForBrowser === null) {
        createWindow()
    }
})


