# Image Compressor

A simple, light weight, and fast multi-image compression tool. This tool runs entirely in the browser, ensuring your files are processed privately and securely on your own device. It is fully functional offline as a Progressive Web App (PWA).

## Features

-   **Client-Side Processing**: All image compression is done in your browser. No files are ever uploaded to a server.
-   **Multiple Format Support**: Upload JPG, PNG, WebP, and SVG images.
-   **Camera Upload**: On mobile devices, you can capture photos directly from the camera.
-   **Flexible Output & Quality Control**: Convert images to JPG, PNG, or WebP and Adjust the quality of  images to find the perfect balance between size and quality.
-   **PWA with Offline Functionality**: Works without an internet connection after the first visit. The app is installable on your device for easy access.
-   **Dark/Light Mode**: Includes a sleek, user-friendly interface with a dark and light mode theme.
-   **Bulk Operations**: Process multiple files at once, with options to download all or clear the queue.
-   **Google Analytics**: PWA installation events are tracked using Google Analytics.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/) built on top of [Radix UI](https://www.radix-ui.com/).
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

This project uses both Radix UI and ShadCN UI. Radix provides the unstyled, accessible, and functional core for the UI components (like dropdowns, sliders, and dialogs). ShadCN UI provides the beautiful, pre-styled components (using Tailwind CSS) that are built upon the Radix primitives.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: Your Google Analytics tracking ID.
`NEXT_PUBLIC_FEEDBACK_FORM_URL`: The URL to your Google Form for feedback.

Create a `.env` file in the root of the project and add the variables like this:

```
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_FEEDBACK_FORM_URL="https://your-google-form-url"
```

## PWA Icons

To ensure your PWA displays correctly on all devices, you'll need to provide icons in various sizes. Place your icon files in the `/public` directory. They are referenced in the `/public/manifest.json` file. It's recommended to have at least the following sizes:

-   192x192 pixels
-   512x512 pixels

You can generate these icons from a single source image using an online PWA icon generator.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Created by [Mehluli Hikwa](https://thatafro.netlify.app/).
