import { useState, useEffect, useRef } from 'react';
import { HueRotateFilter } from './HueRotateFilter';
import './HueRotate.css';

interface HueRotateControlsProps {
    filter: HueRotateFilter;
    onChange?: () => void;
}

function HueRotateControls({ filter, onChange }: HueRotateControlsProps) {
    const [degrees, setDegrees] = useState(filter.degrees);
    const sliderRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        setDegrees(filter.degrees);
    }, [filter]);

    // Update slider overlay based on value (instant)
    useEffect(() => {
        if (sliderRef.current) {
            const percentage = (degrees / 360) * 100;
            sliderRef.current.style.setProperty('--fill-percentage', `${percentage}%`);
        }
    }, [degrees]);

    const handleDegreesChange = (value: number) => {
        setDegrees(value);
        filter.degrees = value;

        // Debounce the actual filter application
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onChange?.();
        }, 150);
    };

    return (
        <div className="hue-rotate-controls">
            <h3>Hue Rotation Settings</h3>
            <div className="control-group">
                <label>
                    <span className="control-label">Rotation: {degrees}°</span>
                    <span className="control-description">Rotate colors around the color wheel</span>
                    <input
                        ref={sliderRef}
                        type="range"
                        min="0"
                        max="360"
                        value={degrees}
                        onChange={(e) => handleDegreesChange(Number(e.target.value))}
                        className="range-slider hue-slider"
                    />
                </label>
            </div>
        </div>
    );
}

// Factory function to create the component
export function createHueRotateControls(
    filter: HueRotateFilter,
    onChange?: () => void
): React.ReactNode {
    return <HueRotateControls filter={filter} onChange={onChange} />;
}

export default HueRotateControls;