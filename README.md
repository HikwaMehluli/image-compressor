# Image Compressor Tool

A simple, lightweight and offline image compression tool for Windows computers. 

MacOS and Linux packages coming soon.

[View Online Demo](https://hikwamehluli.github.io/image-compressor  "Online Demo")

#
## Table of contents

- [Main](#main)
- [Getting started](#getting-started)
- [Options](#options)
- [Methods](#methods)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [License](#license)

#
## Main
*This app has only been tested on Windows*

+ Clone or Download Repo
+ run "npm start" to start the desktop app in dev mode

## Build desktop installable app
*Open terminal in your IDE and run the script for the operating system you need*

### Windows (32/64 bit)
#### Dev dependencies for Windows Insatller
```
npm i electron-winstaller --save-dev
```

#### Build Windows app - which will then be placed in a folder called "release-builds"
```
npm windows-app
```

macOS
```
npm macOS-app
```

# 
# Developers

## Dev dependencies for the UI Design
```
npm i sass --save-dev
```

## Supporting scripts for UX Design
+ Vue.js - https://vuejs.org/
+ Web font is Roboto - https://fonts.google.com/specimen/Roboto

## Dev dependencies for packaging Desktop App
```
npm i electron electron-packager --save-dev
```

## Managing desktop shortcuts & uninstall
```
npm i electron-squirrel-startup
```

#
## License
[MIT](https://opensource.org/licenses/MIT) © [Mehluli Hikwa](https://thatafro.netlify.app/)

#
[⬆ back to top](#table-of-contents)