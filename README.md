# Image Filter Tool

A React + TypeScript web application for applying image filters with real-time preview.

Hosted at https://image-filtering-three.vercel.app/

## Features

### 🖼️ Image Upload
- Drag and drop or click to upload any image
- Supports all common image formats (JPG, PNG, GIF, WebP, etc.)
- Instant preview of the uploaded image

### 🎨 Filters

#### 1. Gaussian Blur
Apply a smooth, professional blur effect to your images.

**Controls:**
- **Radius (1-10)**: Controls the size of the blur kernel. Higher values = stronger blur.
- **Intensity (0.5-5.0)**: Controls the Gaussian sigma value. Higher values = softer, more spread-out blur.


#### 2. Black & White
Convert images to grayscale with adjustable contrast and brightness.

**Controls:**
- **Contrast (-100 to +100)**: Adjusts the difference between light and dark areas
    - Negative values: Reduced contrast (flatter image)
    - Positive values: Increased contrast (more dramatic)
- **Brightness (-100 to +100)**: Adjusts overall image brightness
    - Negative values: Darker image
    - Positive values: Brighter image


## How to Use

1. **Upload an Image**: Click "Choose Image" and select a file
2. **Select a Filter**: Click on "Gaussian Blur" or "Black & White"
3. **Adjust Settings**: Use the sliders to fine-tune the filter effect
4. **View Results**: See the original and filtered images side-by-side

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Filter Implementation Notes

### Gaussian Blur
The Gaussian blur is implemented using a separable convolution:
1. Generate 1D Gaussian kernel based on radius and sigma
2. Apply horizontal pass across all rows
3. Apply vertical pass across all columns
4. Normalize the kernel to maintain brightness

### Black & White
The grayscale conversion uses the luminosity method which accounts for human perception:
- Red: 29.9% weight
- Green: 58.7% weight (highest because humans are most sensitive to green)
- Blue: 11.4% weight

Contrast is applied using the formula:
```
newValue = ((value - 128) × contrastFactor) + 128
```

Brightness is applied as a simple offset:
```
newValue = value + brightnessOffset
```