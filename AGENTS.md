# Image Compressor — Agent Guide

## Quick start

```bash
npm install          # install deps
npm run dev          # Vite dev server → http://localhost:5173 (not 3000 — README is stale)
npm run build        # tsc -b && vite build (typecheck first)
npm run lint         # eslint . (flat config)
npm run format       # prettier --write . (tabs, 4-wide, trailingComma: es5, semicolons)
```

## Architecture

- **React 19 + TypeScript** SPA, entrypoint `src/main.tsx`
- **Tauri v2** shell wrapping the same web app; entrypoint `src-tauri/src/main.rs`, lib in `src-tauri/src/lib.rs`
- **Vite** dev server, `@vitejs/plugin-react-swc`, **Tailwind CSS v4** (no config file, uses `@tailwindcss/vite`)
- **shadcn/ui** (new-york style) for UI primitives, **sonner** for toasts, **lucide-react** for icons
- **Path alias**: `@/` → `./src/` (configured in vite.config.ts + both tsconfigs)
- Image compression is 100% client-side via HTML5 Canvas API (`src/lib/image-processing.ts`)
- Format validation accepts jpeg, jpg, png, webp; default output is webp
- No test framework — no `test` script in package.json

## Tauri

```bash
npm run tauri dev       # Dev with Tauri window (runs vite on :5173 internally)
npm run tauri build     # Production desktop build → Windows outputs .msi + .exe
npm run tauri:android   # tauri android dev
```

- Tauri v2 — use `@tauri-apps/api` v2 imports (not v1)
- CSP is disabled (`"csp": null`)
- Plugins used: dialog, fs, path
- Rust backend (`src-tauri/`) has `image` + `webp` crates available but actual compression is Canvas-based in frontend
- `src-tauri/Cargo.lock` is gitignored; use `cargo` inside `src-tauri/` if working on Rust side
- Fast Rust-only validation: `cargo check` in `src-tauri/` (avoids full frontend build + bundling)
- If changing bundle identifier in `tauri.conf.json`, delete `src-tauri/gen/android/` and re-run `npx tauri android init`

## CI/CD (`.github/workflows/main.yml`)

Triggers on push to `master`. Four matrix jobs for desktop (Linux deb+AppImage, Windows nsis+msi, macOS Intel+ARM dmg), one Android job (signed APK split-per-abi), and optional web deploy to GitHub Pages. Android signing requires repo secrets: `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `ANDROID_KEY_BASE64`.

## TypeScript

- `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`
- Project references: `tsconfig.app.json` (src) + `tsconfig.node.json` (vite.config)

## Conventions

- Tabs for indentation (4-space display width), trailing commas where valid in ES5
- Components in `src/components/`, hooks in `src/hooks/`, lib utils in `src/lib/`, types in `src/types/`
- shadcn UI components live in `src/components/ui/`
- Platform detection: `src/lib/platform.ts` exports `isTauri()`, `isTauriAndroid()`
- Avoid adding comments unless logic is non-obvious
