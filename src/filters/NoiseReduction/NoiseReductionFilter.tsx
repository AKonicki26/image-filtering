import type { IImageFilter } from '../IImageFilter';
import { createNoiseReductionControls } from './NoiseReductionControls';

/**
 * Noise Reduction Filter
 * Reduces image noise using median filtering
 */
export class NoiseReductionFilter implements IImageFilter {
    readonly id = 'noise-reduction';
    readonly name = 'Noise Reduction';
    readonly description = 'Reduce image noise and graininess';

    private _strength: number;

    constructor(strength: number = 1) {
        this._strength = strength;
    }

    get strength(): number {
        return this._strength;
    }

    set strength(value: number) {
        this._strength = Math.max(1, Math.min(5, Math.round(value)));
    }

    apply(imageData: ImageData): ImageData {
        const { data, width, height } = imageData;
        const output = new Uint8ClampedArray(data.length);

        // Copy original data first
        output.set(data);

        // Use median filter to reduce noise
        // Window size based on strength (1=3x3, 2=5x5, etc.)
        const windowSize = this._strength * 2 + 1;
        const halfWindow = Math.floor(windowSize / 2);

        for (let y = halfWindow; y < height - halfWindow; y++) {
            for (let x = halfWindow; x < width - halfWindow; x++) {
                // Collect values for each channel
                const rValues: number[] = [];
                const gValues: number[] = [];
                const bValues: number[] = [];

                // Sample window around pixel
                for (let dy = -halfWindow; dy <= halfWindow; dy++) {
                    for (let dx = -halfWindow; dx <= halfWindow; dx++) {
                        const idx = ((y + dy) * width + (x + dx)) * 4;
                        rValues.push(data[idx]);
                        gValues.push(data[idx + 1]);
                        bValues.push(data[idx + 2]);
                    }
                }

                // Find median for each channel
                const medianR = this.findMedian(rValues);
                const medianG = this.findMedian(gValues);
                const medianB = this.findMedian(bValues);

                // Set output pixel to median values
                const outputIdx = (y * width + x) * 4;
                output[outputIdx] = medianR;
                output[outputIdx + 1] = medianG;
                output[outputIdx + 2] = medianB;
                // Keep original alpha
                output[outputIdx + 3] = data[outputIdx + 3];
            }
        }

        return new ImageData(output, width, height);
    }

    getControls(onChange?: () => void): React.ReactNode {
        return createNoiseReductionControls(this, onChange);
    }

    reset(): void {
        this._strength = 1;
    }

    clone(): NoiseReductionFilter {
        return new NoiseReductionFilter(this._strength);
    }

    /**
     * Find the median value in an array
     */
    private findMedian(values: number[]): number {
        const sorted = values.slice().sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
        }
        return sorted[mid];
    }
}