/**
 * Base interface for all image filters
 * Each filter must implement this interface
 */
export interface IImageFilter {
    /**
     * Unique identifier for the filter
     */
    readonly id: string;

    /**
     * Display name for the filter
     */
    readonly name: string;

    /**
     * Description of what the filter does
     */
    readonly description: string;

    /**
     * Apply the filter to image data
     * @param imageData - The image data to process
     * @returns Processed image data
     */
    apply(imageData: ImageData): ImageData;

    /**
     * Get the React component for filter controls
     * @param onChange - Optional callback when filter parameters change
     * @returns React component or null if no controls
     */
    getControls(onChange?: () => void): React.ReactNode;

    /**
     * Reset filter parameters to default values
     */
    reset(): void;

    /**
     * Clone the filter instance
     */
    clone(): IImageFilter;
}

/**
 * Base image data structure used by filters
 */
export interface FilterImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
}