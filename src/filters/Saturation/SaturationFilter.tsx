import type { IImageFilter } from '../IImageFilter';
import { createSaturationControls } from './SaturationControls';

/**
 * Saturation Filter
 * Adjusts the color intensity of the image
 */
export class SaturationFilter implements IImageFilter {
    readonly id = 'saturation';
    readonly name = 'Saturation';
    readonly description = 'Adjust color intensity';

    private _saturation: number;

    constructor(saturation: number = 100) {
        this._saturation = saturation;
    }

    get saturation(): number {
        return this._saturation;
    }

    set saturation(value: number) {
        this._saturation = Math.max(0, Math.min(200, value));
    }

    apply(imageData: ImageData): ImageData {
        const { data } = imageData;
        const output = new Uint8ClampedArray(data.length);

        const saturationFactor = this._saturation / 100;

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

            // Adjust saturation
            s = Math.max(0, Math.min(1, s * saturationFactor));

            // Convert HSL back to RGB
            let newR: number, newG: number, newB: number;

            if (s === 0) {
                newR = newG = newB = l;
            } else {
                const hue2rgb = (p: number, q: number, t: number): number => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;

                newR = hue2rgb(p, q, h + 1 / 3);
                newG = hue2rgb(p, q, h);
                newB = hue2rgb(p, q, h - 1 / 3);
            }

            output[i] = Math.round(newR * 255);
            output[i + 1] = Math.round(newG * 255);
            output[i + 2] = Math.round(newB * 255);
            output[i + 3] = a;
        }

        return new ImageData(output, imageData.width, imageData.height);
    }

    getControls(onChange?: () => void): React.ReactNode {
        return createSaturationControls(this, onChange);
    }

    reset(): void {
        this._saturation = 100;
    }

    clone(): IImageFilter {
        return new SaturationFilter(this._saturation);
    }
}