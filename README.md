# Image Filtering Tool
A React + TypeScript web application for applying image filters with real-time preview.

**Live Site:** https://image-filtering-three.vercel.app/

## Features

- **Image Upload**: Drag and drop or click to upload images from your device
- **4 Filter Options**:
    - **Gaussian Blur** - Smooth blur effect with adjustable radius and intensity
    - **Black & White** - Grayscale conversion with contrast and brightness controls
    - **Hue Rotate** - Shift colors around the color wheel (0-360°)
    - **Sharpen** - Enhance edges and details with adjustable intensity
- **Real-time Preview**: See changes instantly as you adjust filter settings
- **Side-by-Side Comparison**: View original and filtered images simultaneously
- **Interactive Controls**: Sliders for fine-tuning each filter's parameters

## Technologies & Dependencies

**Programming Languages:**
- TypeScript 5.x
- HTML5 Canvas API

**Framework & Libraries:**
- React 19.2.0
- React DOM 19.2.0
- Vite (build tool)

**Development Dependencies:**
- @types/node ^20
- @types/react ^19
- @types/react-dom ^19
- @typescript-eslint/eslint-plugin 8.47.0
- @typescript-eslint/parser 8.47.0
- @vitejs/plugin-react 4.3.4
- eslint 9.x
- typescript 5.x
- vite 6.x

## Setup Instructions

### Clone the Repository
```bash
git clone https://github.com/AKonicki26/image-filtering
cd image-filter
```

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

The app will open at `http://localhost:5173` (or whatever port Vite assigns).

### Build for Production
```bash
npm run build
```

The optimized build will be in the `dist` folder.

## File Structure

```
image-filter/
├── src/
│   ├── components/
│   │   └── ImageTransformer/
│   │       ├── ImageTransformer.tsx       # Main component with upload/display logic
│   │       └── ImageTransformer.css       # Component styles
│   ├── filters/
│   │   ├── IImageFilter.tsx               # Interface all filters implement
│   │   ├── index.tsx                      # Central export for all filters
│   │   ├── GaussianBlur/
│   │   │   ├── GaussianBlurFilter.tsx     # Blur algorithm implementation
│   │   │   ├── GaussianBlurControls.tsx   # UI controls for blur settings
│   │   │   └── GaussianBlur.css           # Blur control styles
│   │   ├── BlackAndWhite/
│   │   │   ├── BlackAndWhiteFilter.tsx    # Grayscale algorithm
│   │   │   ├── BlackAndWhiteControls.tsx  # UI controls for B&W settings
│   │   │   └── BlackAndWhite.css          # B&W control styles
│   │   ├── HueRotate/
│   │   │   ├── HueRotateFilter.tsx        # Hue rotation algorithm
│   │   │   ├── HueRotateControls.tsx      # UI controls for hue rotation
│   │   │   └── HueRotate.css              # Hue rotate control styles
│   │   └── Sharpen/
│   │       ├── SharpenFilter.tsx          # Sharpening algorithm
│   │       ├── SharpenControls.tsx        # UI controls for sharpen settings
│   │       └── Sharpen.css                # Sharpen control styles
│   ├── App.tsx                            # Root component
│   ├── App.css                            # App-level styles
│   ├── main.tsx                           # React entry point
│   └── index.css                          # Global styles
├── public/                                 # Static assets
├── index.html                             # HTML entry point
├── package.json                           # Dependencies and scripts
├── tsconfig.json                          # TypeScript configuration
├── vite.config.ts                         # Vite build configuration
└── README.md                              # This file
```

**Key Files Explained:**
- `ImageTransformer.tsx`: Handles image upload, manages filter state, and coordinates between the UI and filter logic
- `IImageFilter.tsx`: Defines the interface that all filters must implement (apply, getControls, reset, clone)
- Each filter folder contains three files: the algorithm, the controls component, and the styles
- `filters/index.tsx`: Exports all filters so they can be imported together

## How It Works

1. Upload an image through the UI
2. The image is converted to `ImageData` using HTML5 Canvas
3. Select a filter from the available options
4. Adjust filter parameters using the sliders
5. The filter's `apply()` method processes the ImageData pixel-by-pixel
6. The filtered result is displayed alongside the original

Each filter implements the `IImageFilter` interface, making it easy to add new filters by following the same pattern.
