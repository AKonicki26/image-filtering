import type {IImageFilter} from '../IImageFilter';
import { createSharpenControls } from './SharpenControls';

/**
 * Sharpen Filter
 * Enhances edges and details in the image using convolution
 */
export class SharpenFilter implements IImageFilter {
    readonly id = 'sharpen';
    readonly name = 'Sharpen';
    readonly description = 'Enhance edges and details in the image';

    private _amount: number;

    constructor(amount: number = 1) {
        this._amount = amount;
    }

    get amount(): number {
        return this._amount;
    }

    set amount(value: number) {
        this._amount = Math.max(0, Math.min(3, value));
    }

    apply(imageData: ImageData): ImageData {
        const { data, width, height } = imageData;
        const output = new Uint8ClampedArray(data.length);

        // Copy original data first
        output.set(data);

        // Sharpen kernel - adjustable based on amount
        // Standard sharpen kernel:
        //  0  -1   0
        // -1   5  -1
        //  0  -1   0

        const centerWeight = 1 + (4 * this._amount);
        const edgeWeight = -this._amount;

        const kernel = [
            0, edgeWeight, 0,
            edgeWeight, centerWeight, edgeWeight,
            0, edgeWeight, 0
        ];

        // Apply convolution (skip edges to avoid boundary issues)
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) { // RGB channels only
                    let sum = 0;

                    // Apply 3x3 kernel
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            const kernelIdx = (ky + 1) * 3 + (kx + 1);
                            sum += data[idx] * kernel[kernelIdx];
                        }
                    }

                    const outputIdx = (y * width + x) * 4 + c;
                    output[outputIdx] = Math.min(255, Math.max(0, sum));
                }

                // Keep alpha channel unchanged
                const alphaIdx = (y * width + x) * 4 + 3;
                output[alphaIdx] = data[alphaIdx];
            }
        }

        return new ImageData(output, width, height);
    }

    getControls(onChange?: () => void): React.ReactNode {
        return createSharpenControls(this, onChange);
    }

    reset(): void {
        this._amount = 1;
    }

    clone(): SharpenFilter {
        return new SharpenFilter(this._amount);
    }
}