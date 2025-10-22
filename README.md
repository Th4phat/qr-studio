# QR Studio

A modern, client-first web application for creating, scanning, and manipulating QR codes with advanced features and a clean, responsive interface.

## 🚀 Features

### QR Code Creation
- **Simple Mode**: Quick text/URL input with instant preview
- **Advanced Mode**: Full customization with presets, error correction, and styling options
- **Export Options**: Download as PNG or SVG with customizable quality and dimensions
- **Live Preview**: Real-time QR code generation as you type

### QR Code Scanning
- **File Upload**: Drag & drop or select image files to scan
- **Clipboard Support**: Paste images directly from clipboard
- **Camera Scanning**: Use device camera with permission controls
- **Multiple Formats**: Supports various QR code types (URL, email, WiFi, vCard)

### Advanced Features
- **Error Correction**: Choose from L, M, Q, H levels for better scan reliability
- **Custom Styling**: Colors, rounded modules, eye shapes, and logo overlays
- **Local History**: Store and manage your QR codes locally
- **Internationalization**: Multi-language support with easy switching
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: [Solid.js](https://solidjs.com/) - Reactive JavaScript framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast development and build tool
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **QR Generation**: [qrcode](https://www.npmjs.com/package/qrcode) - Robust QR code generation
- **QR Scanning**: [qr-scanner](https://www.npmjs.com/package/qr-scanner) - Fast QR code scanning
- **Storage**: [localForage](https://localforage.github.io/localForage/) - Offline storage
- **Routing**: [@solidjs/router](https://github.com/solidjs/solid-router) - Client-side routing
- **i18n**: [@solid-primitives/i18n](https://github.com/solidjs-community/solid-primitives/tree/main/packages/i18n) - Internationalization

## 📦 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Setup
```bash
# Clone the repository
git clone https://github.com/th4phat/qr-studio.git
cd qr-studio

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun run dev
```

## 🎯 Usage

### Creating QR Codes
1. Navigate to the **Create** page
2. Choose between Simple or Advanced mode
3. Enter your text or URL
4. Customize options (colors, size, error correction)
5. Download as PNG or SVG

### Scanning QR Codes
1. Navigate to the **Scan** page
2. Choose your scanning method:
   - **File Upload**: Select an image file
   - **Clipboard**: Paste an image
   - **Camera**: Use your device camera
3. View the decoded results
4. Copy, open, or save the scanned data

### Managing History
1. Navigate to the **History** page
2. View all your created and scanned QR codes
3. Search and filter by type or date
4. Export your history as JSON

## 📱 Responsive Design

QR Studio is built with a mobile-first approach and includes:
- **Desktop Layout**: Multi-column interface with advanced controls
- **Mobile Layout**: Optimized single-column interface
- **Adaptive Components**: UI elements that adjust based on screen size
- **Touch-Friendly**: Large buttons and gestures for mobile devices

## 🔒 Privacy & Security

- **Client-First**: All operations happen in your browser
- **No Data Transmission**: Your QR codes and data never leave your device
- **Local Storage**: Uses IndexedDB for reliable offline storage
- **Secure Context**: Requires HTTPS for camera and clipboard access

## 🚀 Building for Production

```bash
# Build the application
npm run build
# or
bun run build

# Preview the production build
npm run preview
# or
bun run preview
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solid.js](https://solidjs.com/) for the amazing reactive framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [qrcode](https://www.npmjs.com/package/qrcode) and [qr-scanner](https://www.npmjs.com/package/qr-scanner) for the core QR code functionality
- [localForage](https://localforage.github.io/localForage/) for offline storage

---

Made with ❤️ using Solid.js and TypeScript