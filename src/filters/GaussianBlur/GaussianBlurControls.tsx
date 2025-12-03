import { useState, useEffect, useRef } from 'react';
import { GaussianBlurFilter } from './GaussianBlurFilter';
import './GaussianBlur.css';

interface GaussianBlurControlsProps {
    filter: GaussianBlurFilter;
    onChange?: () => void;
}

function GaussianBlurControls({ filter, onChange }: GaussianBlurControlsProps) {
    const [radius, setRadius] = useState(filter.radius);
    const [sigma, setSigma] = useState(filter.sigma);
    const radiusRef = useRef<HTMLInputElement>(null);
    const sigmaRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        setRadius(filter.radius);
        setSigma(filter.sigma);
    }, [filter]);

    // Update slider background based on value (this is instant)
    useEffect(() => {
        if (radiusRef.current) {
            const percentage = ((radius - 1) / (10 - 1)) * 100;
            radiusRef.current.style.setProperty('--value-percentage', `${percentage}%`);
        }
    }, [radius]);

    useEffect(() => {
        if (sigmaRef.current) {
            const percentage = ((sigma - 0.5) / (5 - 0.5)) * 100;
            sigmaRef.current.style.setProperty('--value-percentage', `${percentage}%`);
        }
    }, [sigma]);

    const handleRadiusChange = (value: number) => {
        setRadius(value);
        filter.radius = value;

        // Debounce the actual filter application
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onChange?.();
        }, 150); // Wait 150ms after user stops moving slider
    };

    const handleSigmaChange = (value: number) => {
        setSigma(value);
        filter.sigma = value;

        // Debounce the actual filter application
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onChange?.();
        }, 150); // Wait 150ms after user stops moving slider
    };

    return (
        <div className="gaussian-blur-controls">
            <h3>Blur Settings</h3>
            <div className="control-group">
                <label>
                    <span className="control-label">Radius: {radius}</span>
                    <span className="control-description">Size of the blur kernel</span>
                    <input
                        ref={radiusRef}
                        type="range"
                        min="1"
                        max="10"
                        value={radius}
                        onChange={(e) => handleRadiusChange(Number(e.target.value))}
                        className="range-slider"
                    />
                </label>

                <label>
                    <span className="control-label">Intensity: {sigma.toFixed(1)}</span>
                    <span className="control-description">Smoothness of the blur</span>
                    <input
                        ref={sigmaRef}
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={sigma}
                        onChange={(e) => handleSigmaChange(Number(e.target.value))}
                        className="range-slider"
                    />
                </label>
            </div>
        </div>
    );
}

// Factory function to create the component
export function createGaussianBlurControls(
    filter: GaussianBlurFilter,
    onChange?: () => void
): React.ReactNode {
    return <GaussianBlurControls filter={filter} onChange={onChange} />;
}

export default GaussianBlurControls;