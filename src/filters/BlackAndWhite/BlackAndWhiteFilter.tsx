import type {IImageFilter} from '../IImageFilter';
import { createBlackAndWhiteControls } from './BlackAndWhiteControls';

/**
 * Black and White Filter
 * Converts image to grayscale with adjustable contrast and brightness
 */
export class BlackAndWhiteFilter implements IImageFilter {
    readonly id = 'black-and-white';
    readonly name = 'Black & White';
    readonly description = 'Convert to grayscale with contrast and brightness controls';

    private _contrast: number;
    private _brightness: number;

    constructor(contrast: number = 0, brightness: number = 0) {
        this._contrast = contrast;
        this._brightness = brightness;
    }

    get contrast(): number {
        return this._contrast;
    }

    set contrast(value: number) {
        this._contrast = Math.max(-100, Math.min(100, value));
    }

    get brightness(): number {
        return this._brightness;
    }

    set brightness(value: number) {
        this._brightness = Math.max(-100, Math.min(100, value));
    }

    apply(imageData: ImageData): ImageData {
        const { data, width, height } = imageData;
        const output = new Uint8ClampedArray(data.length);

        // Contrast factor: maps -100..100 to 0.5..2.5
        const contrastFactor = (this._contrast + 100) / 100;
        // Brightness offset: maps -100..100 to -255..255
        const brightnessOffset = (this._brightness / 100) * 255;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Convert to grayscale using luminosity method
            // Human eye is more sensitive to green, then red, then blue
            let gray = 0.299 * r + 0.587 * g + 0.114 * b;

            // Apply contrast
            gray = ((gray - 128) * contrastFactor) + 128;

            // Apply brightness
            gray = gray + brightnessOffset;

            // Clamp to valid range
            gray = Math.max(0, Math.min(255, gray));

            output[i] = gray;
            output[i + 1] = gray;
            output[i + 2] = gray;
            output[i + 3] = a;
        }

        return new ImageData(output, width, height);
    }

    getControls(onChange?: () => void): React.ReactNode {
        return createBlackAndWhiteControls(this, onChange);
    }

    reset(): void {
        this._contrast = 0;
        this._brightness = 0;
    }

    clone(): BlackAndWhiteFilter {
        return new BlackAndWhiteFilter(this._contrast, this._brightness);
    }
}