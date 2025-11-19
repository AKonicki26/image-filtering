import type {IImageFilter} from '../IImageFilter';
import { createGaussianBlurControls } from './GaussianBlurControls';

/**
 * Gaussian Blur Filter
 * Applies a smooth blur effect using separable 2D Gaussian convolution
 */
export class GaussianBlurFilter implements IImageFilter {
    readonly id = 'gaussian-blur';
    readonly name = 'Gaussian Blur';
    readonly description = 'Apply a smooth blur effect to the image';

    private _radius: number;
    private _sigma: number;

    constructor(radius: number = 3, sigma: number = 2) {
        this._radius = radius;
        this._sigma = sigma;
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = Math.max(1, Math.min(10, value));
    }

    get sigma(): number {
        return this._sigma;
    }

    set sigma(value: number) {
        this._sigma = Math.max(0.5, Math.min(5, value));
    }

    apply(imageData: ImageData): ImageData {
        const { data, width, height } = imageData;
        const output = new Uint8ClampedArray(data.length);

        // Generate Gaussian kernel
        const kernel = this.generateGaussianKernel(this._radius, this._sigma);
        const kernelSize = kernel.length;
        const halfKernel = Math.floor(kernelSize / 2);

        // Apply horizontal pass
        const temp = new Uint8ClampedArray(data.length);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;

                for (let i = 0; i < kernelSize; i++) {
                    const offsetX = x + i - halfKernel;
                    const clampedX = Math.max(0, Math.min(width - 1, offsetX));
                    const idx = (y * width + clampedX) * 4;

                    r += data[idx] * kernel[i];
                    g += data[idx + 1] * kernel[i];
                    b += data[idx + 2] * kernel[i];
                    a += data[idx + 3] * kernel[i];
                }

                const idx = (y * width + x) * 4;
                temp[idx] = r;
                temp[idx + 1] = g;
                temp[idx + 2] = b;
                temp[idx + 3] = a;
            }
        }

        // Apply vertical pass
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;

                for (let i = 0; i < kernelSize; i++) {
                    const offsetY = y + i - halfKernel;
                    const clampedY = Math.max(0, Math.min(height - 1, offsetY));
                    const idx = (clampedY * width + x) * 4;

                    r += temp[idx] * kernel[i];
                    g += temp[idx + 1] * kernel[i];
                    b += temp[idx + 2] * kernel[i];
                    a += temp[idx + 3] * kernel[i];
                }

                const idx = (y * width + x) * 4;
                output[idx] = Math.round(r);
                output[idx + 1] = Math.round(g);
                output[idx + 2] = Math.round(b);
                output[idx + 3] = Math.round(a);
            }
        }

        return new ImageData(output, width, height);
    }

    getControls(onChange?: () => void): React.ReactNode {
        return createGaussianBlurControls(this, onChange);
    }

    reset(): void {
        this._radius = 3;
        this._sigma = 2;
    }

    clone(): GaussianBlurFilter {
        return new GaussianBlurFilter(this._radius, this._sigma);
    }

    /**
     * Generate a 1D Gaussian kernel
     */
    private generateGaussianKernel(radius: number, sigma: number): number[] {
        const size = radius * 2 + 1;
        const kernel: number[] = [];
        let sum = 0;

        for (let i = 0; i < size; i++) {
            const x = i - radius;
            const value = Math.exp(-(x * x) / (2 * sigma * sigma));
            kernel.push(value);
            sum += value;
        }

        // Normalize kernel
        return kernel.map(v => v / sum);
    }
}