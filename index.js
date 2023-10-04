const { app, BrowserWindow, Menu, shell } = require('electron')
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

	// Create the menu template
	const template = [
		{
			label: 'About',
			submenu: [
				{
					label: 'Author Info',
					click: () => {
						shell.openExternal('https://thatafro.netlify.app/')
					}
				}
			]
		}
	]

	// Build the menu from the template
	const menu = Menu.buildFromTemplate(template)

	// Set the menu as the application menu
	Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})