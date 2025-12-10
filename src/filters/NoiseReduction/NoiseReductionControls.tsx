import { useState, useEffect, useRef } from 'react';
import { NoiseReductionFilter } from './NoiseReductionFilter';
import './NoiseReduction.css';

interface NoiseReductionControlsProps {
    filter: NoiseReductionFilter;
    onChange?: () => void;
}

function NoiseReductionControls({ filter, onChange }: NoiseReductionControlsProps) {
    const [strength, setStrength] = useState(filter.strength);
    const sliderRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        setStrength(filter.strength);
    }, [filter]);

    // Update slider background based on value (instant)
    useEffect(() => {
        if (sliderRef.current) {
            const percentage = ((strength - 1) / (5 - 1)) * 100;
            sliderRef.current.style.setProperty('--value-percentage', `${percentage}%`);
        }
    }, [strength]);

    const handleStrengthChange = (value: number) => {
        setStrength(value);
        filter.strength = value;

        // Debounce the actual filter application
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onChange?.();
        }, 150);
    };

    return (
        <div className="noise-reduction-controls">
            <h3>Noise Reduction Settings</h3>
            <div className="control-group">
                <label>
                    <span className="control-label">Strength: {strength}</span>
                    <span className="control-description">Higher values remove more noise but may blur details</span>
                    <input
                        ref={sliderRef}
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={strength}
                        onChange={(e) => handleStrengthChange(Number(e.target.value))}
                        className="range-slider"
                    />
                </label>
            </div>
        </div>
    );
}

// Factory function to create the component
export function createNoiseReductionControls(
    filter: NoiseReductionFilter,
    onChange?: () => void
): React.ReactNode {
    return <NoiseReductionControls filter={filter} onChange={onChange} />;
}

export default NoiseReductionControls;