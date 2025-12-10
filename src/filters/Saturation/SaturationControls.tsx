import { useState, useEffect, useRef } from 'react';
import { SaturationFilter } from './SaturationFilter';
import './Saturation.css';

interface SaturationControlsProps {
    filter: SaturationFilter;
    onChange?: () => void;
}

function SaturationControls({ filter, onChange }: SaturationControlsProps) {
    const [saturation, setSaturation] = useState(filter.saturation);
    const sliderRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        setSaturation(filter.saturation);
    }, [filter]);

    // Update slider background based on value (instant)
    useEffect(() => {
        if (sliderRef.current) {
            const percentage = ((saturation - 0) / (200 - 0)) * 100;
            sliderRef.current.style.setProperty('--value-percentage', `${percentage}%`);
        }
    }, [saturation]);

    const handleSaturationChange = (value: number) => {
        setSaturation(value);
        filter.saturation = value;

        // Debounce the actual filter application
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onChange?.();
        }, 150);
    };

    return (
        <div className="saturation-controls">
            <h3>Saturation Settings</h3>
            <div className="control-group">
                <label>
                    <span className="control-label">Saturation: {saturation}%</span>
                    <span className="control-description">Adjust color intensity (0% = grayscale, 100% = normal, 200% = vivid)</span>
                    <input
                        ref={sliderRef}
                        type="range"
                        min="0"
                        max="200"
                        value={saturation}
                        onChange={(e) => handleSaturationChange(Number(e.target.value))}
                        className="range-slider"
                    />
                </label>
            </div>
        </div>
    );
}

// Factory function to create the component
export function createSaturationControls(
    filter: SaturationFilter,
    onChange?: () => void
): React.ReactNode {
    return <SaturationControls filter={filter} onChange={onChange} />;
}

export default SaturationControls;