const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		},
		icon: path.join(__dirname, './img/512.png')
	})

	win.loadFile('index.html')

	// Create Menu Items
	const template = [
		{
			label: 'File',
			submenu: [
				{
					label: 'Open',
					click: () => {
						// Handle the "Open" menu item click
					}
				},
				{
					label: 'Save',
					click: () => {
						// Handle the "Save" menu item click
					}
				},
				{ type: 'separator' },
				{
					label: 'Exit',
					click: () => {
						app.quit()
					}
				}
			]
		},
		{
			label: 'About',
			submenu: [
				{
					label: 'Author Info',
					click: () => {
						// Handle the "Save" menu item click
					}
				}
			]
		}
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})