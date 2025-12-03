import { useState, useEffect, useRef } from 'react';
import { BlackAndWhiteFilter } from './BlackAndWhiteFilter';
import './BlackAndWhite.css';

interface BlackAndWhiteControlsProps {
    filter: BlackAndWhiteFilter;
    onChange?: () => void;
}

function BlackAndWhiteControls({ filter, onChange }: BlackAndWhiteControlsProps) {
    const [contrast, setContrast] = useState(filter.contrast);
    const [brightness, setBrightness] = useState(filter.brightness);
    const contrastRef = useRef<HTMLInputElement>(null);
    const brightnessRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        setContrast(filter.contrast);
        setBrightness(filter.brightness);
    }, [filter]);

    // Update slider backgrounds based on values (instant)
    useEffect(() => {
        if (contrastRef.current) {
            const percentage = ((contrast - (-100)) / (100 - (-100))) * 100;
            contrastRef.current.style.setProperty('--value-percentage', `${percentage}%`);
        }
    }, [contrast]);

    useEffect(() => {
        if (brightnessRef.current) {
            const percentage = ((brightness - (-100)) / (100 - (-100))) * 100;
            brightnessRef.current.style.setProperty('--value-percentage', `${percentage}%`);
        }
    }, [brightness]);

    const handleContrastChange = (value: number) => {
        setContrast(value);
        filter.contrast = value;

        // Debounce the actual filter application
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onChange?.();
        }, 150);
    };

    const handleBrightnessChange = (value: number) => {
        setBrightness(value);
        filter.brightness = value;

        // Debounce the actual filter application
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onChange?.();
        }, 150);
    };

    return (
        <div className="black-and-white-controls">
            <h3>Black & White Settings</h3>
            <div className="control-group">
                <label>
                    <span className="control-label">Contrast: {contrast}</span>
                    <span className="control-description">Adjust the difference between light and dark</span>
                    <input
                        ref={contrastRef}
                        type="range"
                        min="-100"
                        max="100"
                        value={contrast}
                        onChange={(e) => handleContrastChange(Number(e.target.value))}
                        className="range-slider"
                    />
                </label>

                <label>
                    <span className="control-label">Brightness: {brightness}</span>
                    <span className="control-description">Adjust overall image brightness</span>
                    <input
                        ref={brightnessRef}
                        type="range"
                        min="-100"
                        max="100"
                        value={brightness}
                        onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                        className="range-slider"
                    />
                </label>
            </div>
        </div>
    );
}

// Factory function to create the component
export function createBlackAndWhiteControls(
    filter: BlackAndWhiteFilter,
    onChange?: () => void
): React.ReactNode {
    return <BlackAndWhiteControls filter={filter} onChange={onChange} />;
}

export default BlackAndWhiteControls;