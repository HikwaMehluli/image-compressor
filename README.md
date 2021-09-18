# Image Compressor Tool

A simple, lightweight and offline image compression tool for Windows computers. 

MacOS and Linux packages coming soon.

[View Online Demo](https://hikwamehluli.github.io/image-compressor  "Online Demo")

#
## Table of contents

- [Creating Builds](#creating-builds)
- [Development Dependencies](#development-dependencies)
- [License](#license)


# 
## Creating Builds
### Windows (32bit) - Package & Build
*Open CMD or terminal in your IDE and run the script below*
<br>

```
npm package-win
```

After running the script the output folder should look like this.
```text
release-builds/
    |
    └── image-compressor-win32-ia32
```
This folder is a portable version of the offline image compression tool for Windows computers.

Next Step - Creating an installable version of the app. Run the script below.
```
npm create-installer-win
```

Your folder structure should look like this if successful. And the "windows-intaller" folder is your offline app.
```
release-builds/
    ├── image-compressor-win32-ia32
    └── windows-installer
```

[⬆ back to top](#table-of-contents)

# 
## Development Dependencies

### UI Design - SASS
```
npm i sass --save-dev
```

### For packaging desktop apps
```
npm i electron electron-packager --save-dev
```

### For creating a Windows executable(.exe) file
```
npm i electron-winstaller --save-dev
```

### For managing desktop shortcuts & uninstall
```
npm i electron-squirrel-startup
```

### Supporting scripts for UX Design
+ Vue.js - https://vuejs.org/
+ Web font is Roboto - https://fonts.google.com/specimen/Roboto

[⬆ back to top](#table-of-contents)

#
## License
[MIT](https://opensource.org/licenses/MIT) © [Mehluli Hikwa](https://thatafro.netlify.app/)

#
[⬆ back to top](#table-of-contents)