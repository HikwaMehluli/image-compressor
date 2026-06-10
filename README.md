# 🖼️ Digital Image Compressor

**Free and Open Source Image Compressor** that works completely on your device - no internet required! Optimizes images `locally`, delivering unmatched efficiency `without storing a single file`. Experience lightning-fast compression, all in one place.

## 🌐 Live Demo

Try it out: [https://image-compressor.github.io](https://image-compressor.github.io)

## 🤔 What Does This App Do?

Imagine you have a big, heavy photo that takes forever to send or upload. This app is like a magical shrinking machine that makes your photos smaller while keeping them looking great! 

**Simple Steps:**
1. 📤 Drag your photos to the app
2. ⚙️ Choose how much to compress (slider)
3. ✨ Watch the magic happen
4. 📦 Download your smaller photos

## 🏗️ How It's Built (For Developers)

### 📋 Project Structure (Like Building Blocks!)

```
image-compressor/                 # Main project folder
├── public/                      # Website files (logo, icons)
├── src/                         # All the code that makes it work
│   ├── components/              # The visual parts you see
│   │   ├── ui/                  # Basic building blocks (buttons, menus)
│   │   ├── action-buttons.tsx   # Buttons for downloading/resetting
│   │   ├── compressed-images-grid.tsx # Shows your processed photos
│   │   ├── drop-zone.tsx        # Where you drag your photos
│   │   ├── image-quality-slider.tsx # Controls compression amount
│   │   └── ...                  # And more visual parts
│   ├── hooks/                   # Smart helpers that do the work
│   │   ├── useImageCompression.ts # Main brain for processing photos
│   │   └── useDragAndDrop.ts    # Handles dragging photos around
│   ├── lib/                     # Special tools for specific jobs
│   │   ├── image-processing.ts  # The magic shrinking machine code
│   │   ├── file-validation.ts   # Checks if files are really photos
│   │   ├── download.ts          # Handles saving files to your computer
│   │   └── ...                  # And other utilities
│   ├── types/                   # Defines what kinds of data we use
│   └── App.tsx                  # Main controller that connects everything
├── src-tauri/                   # Makes it work as a desktop app too
├── package.json                 # Lists all the tools we use
└── README.md                    # This file!
```

### 🧠 How It Works (Step-by-Step)

**Step 1: You Upload Photos**
- You drag photos to the `DropZone` component
- `file-validation.ts` checks: "Are these really photos?" (only JPG, PNG, WEBP allowed)
- If yes, they go to the processing queue

**Step 2: The Magic Happens**
- `useImageCompression.ts` takes over as the main coordinator
- For each photo, it calls the `processImages` function in `image-processing.ts`
- Each photo goes through 2 steps:
  1. **Compression**: Shrinks using HTML5 Canvas API (like squishing with a digital rolling pin)
  2. **Format Conversion**: Changes type if needed (JPG ↔ PNG ↔ WEBP)

**Step 3: You See Results**
- Processed photos appear in a nice grid
- You can see how much smaller they became
- Download individual photos or a ZIP file

### 🛠️ Technical Details

**Technology Stack:**
- **Frontend**: React + TypeScript (building blocks for web)
- **UI Components**: shadcn/ui (pretty, accessible buttons/menus)
- **Build Tool**: Vite (makes development fast)
- **Desktop App**: Tauri (wraps web app for computers)
- **Styling**: Tailwind CSS (makes everything look good)

**Privacy & Security:**
- ✅ All processing happens on YOUR computer
- ✅ No photos ever leave your device
- ✅ No internet required for compression
- ✅ Open source (anyone can check the code)

**Performance Features:**
- ⚡ Fast processing with HTML5 Canvas
- 📊 Progress tracking for each photo
- 🧹 Memory cleanup after each image
- 🔄 Sequential processing to prevent crashes

## 🚀 Quick Start Guide

### For Users (Just Want to Use It)
1. Visit [https://image-compressor.github.io](https://image-compressor.github.io)
2. Drag your photos to the box
3. Adjust the slider to choose compression level
4. Download your smaller photos!

### For Developers (Want to Build It)

#### Prerequisites
- Node.js version `20+` and `npm` installed
- For desktop app: Rust toolchain installed

#### Installation Steps
```bash
# Get the code
git clone https://github.com/hikwamehluli/image-compressor.git
cd image-compressor

# Install tools
npm install

# Start the app
npm run dev
```

Then open your browser to http://localhost:3000 to use the app!

#### Available Commands
```bash
# Development
npm run dev          # Start development server (recommended)
npm run start        # Alternative (same as dev)

# Building
npm run build        # Create production version
npm run preview      # Test production build locally

# Desktop App
npm run tauri dev    # Run as desktop app (development)
npm run tauri build  # Build desktop app installer

# Code Quality
npm run lint         # Check for code problems
npm run format       # Fix code formatting
```

## 🎯 Features That Make Life Easy

- **🖼️ Multiple Formats**: Works with JPG, PNG, WebP photos
- **🎚️ Quality Control**: Slide to choose how much smaller you want photos
- **📦 Batch Magic**: Compress many photos at once
- **💾 Easy Downloads**: Get individual photos or ZIP folder
- **🖱️ Drag & Drop**: Just drag photos anywhere on screen
- **📱 Works Everywhere**: Computer, tablet, phone - all work!
- **🌙 Light/Dark Mode**: Choose your favorite look
- **🔒 Super Private**: Photos never leave your device
- **⚡ Super Fast**: Processes happen instantly on your device
- **🖥️ Also a Desktop App**: Install on your computer too

## 🛠️ For Developers Who Want to Contribute

### Getting Started
1. 🍴 Fork the repository (click "Fork" button on GitHub)
2. 🌿 Create a new branch: `git checkout -b add-amazing-feature`
3. 📦 Install: `npm install`
4. 🚀 Start: `npm run dev`
5. ✏️ Make your changes
6. ✅ Test everything works
7. 💾 Commit: `git commit -m 'Add amazing feature'`
8. 📤 Push: `git push origin add-amazing-feature`
9. 🔄 Open a Pull Request on GitHub

### Coding Guidelines
- Use TypeScript (it helps catch mistakes early!)
- Keep components small and focused
- Add comments for complex code
- Follow existing code style
- Write clear, descriptive commit messages

### Ways to Help
- 🆕 Add support for more image formats
- 🚀 Make compression faster
- 🎨 Improve the user interface
- 📱 Make it work better on phones
- ♿ Make it more accessible
- 📝 Improve documentation

## 📜 License

This project is free and open source under the MIT License - anyone can use, modify, and share it!

## 👤 Author

Created with ❤️ by [Hikwam](https://www.github.com/hikwamehluli)

## 🤝 Support

Found a problem? Have a cool idea? Feel free to [open an issue](https://github.com/hikwamehluli/image-compressor/issues) on GitHub!
