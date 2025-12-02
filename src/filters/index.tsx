// Export the interface
export type { IImageFilter } from './IImageFilter';

// Export filter implementations
export { GaussianBlurFilter } from './GaussianBlur/GaussianBlurFilter';
export { BlackAndWhiteFilter } from './BlackAndWhite/BlackAndWhiteFilter';
export { HueRotateFilter } from './HueRotate/HueRotateFilter.tsx';
export { SharpenFilter } from './Sharpen/SharpenFilter';