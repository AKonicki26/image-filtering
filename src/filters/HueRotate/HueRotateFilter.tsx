import type {IImageFilter} from '../IImageFilter';
import { createHueRotateControls } from './HueRotateControls.tsx';

/**
 * Hue Rotate Filter
 * Rotates the hue of all colors in the image by a specified degree
 */
export class HueRotateFilter implements IImageFilter {
    readonly id = 'hue-rotate';
    readonly name = 'Hue Rotate';
    readonly description = 'Rotate colors around the color wheel';

    private _degrees: number;

    constructor(degrees: number = 0) {
        this._degrees = degrees;
    }

    get degrees(): number {
        return this._degrees;
    }

    set degrees(value: number) {
        this._degrees = value % 360;
        if (this._degrees < 0) this._degrees += 360;
    }

    apply(imageData: ImageData): ImageData {
        const { data, width, height } = imageData;
        const output = new Uint8ClampedArray(data.length);

        const angle = (this._degrees * Math.PI) / 180;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;
            const a = data[i + 3];

            // Convert RGB to HSL
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0;
            let s = 0;
            const l = (max + min) / 2;

            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                switch (max) {
                    case r:
                        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                        break;
                    case g:
                        h = ((b - r) / d + 2) / 6;
                        break;
                    case b:
                        h = ((r - g) / d + 4) / 6;
                        break;
                }
            }

            // Rotate hue
            h = (h + angle / (2 * Math.PI)) % 1;
            if (h < 0) h += 1;

            // Convert back to RGB
            const hueToRgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            let newR: number, newG: number, newB: number;

            if (s === 0) {
                newR = newG = newB = l;
            } else {
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                newR = hueToRgb(p, q, h + 1 / 3);
                newG = hueToRgb(p, q, h);
                newB = hueToRgb(p, q, h - 1 / 3);
            }

            output[i] = Math.round(newR * 255);
            output[i + 1] = Math.round(newG * 255);
            output[i + 2] = Math.round(newB * 255);
            output[i + 3] = a;
        }

        return new ImageData(output, width, height);
    }

    getControls(onChange?: () => void): React.ReactNode {
        return createHueRotateControls(this, onChange);
    }

    reset(): void {
        this._degrees = 0;
    }

    clone(): HueRotateFilter {
        return new HueRotateFilter(this._degrees);
    }
}