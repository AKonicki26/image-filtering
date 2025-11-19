import { useState, useEffect } from 'react';
import { GaussianBlurFilter } from './GaussianBlurFilter';
import './GaussianBlur.css';

interface GaussianBlurControlsProps {
    filter: GaussianBlurFilter;
    onChange?: () => void;
}

function GaussianBlurControls({ filter, onChange }: GaussianBlurControlsProps) {
    const [radius, setRadius] = useState(filter.radius);
    const [sigma, setSigma] = useState(filter.sigma);

    useEffect(() => {
        setRadius(filter.radius);
        setSigma(filter.sigma);
    }, [filter]);

    const handleRadiusChange = (value: number) => {
        setRadius(value);
        filter.radius = value;
        onChange?.();
    };

    const handleSigmaChange = (value: number) => {
        setSigma(value);
        filter.sigma = value;
        onChange?.();
    };

    return (
        <div className="gaussian-blur-controls">
            <h3>Blur Settings</h3>
            <div className="control-group">
                <label>
                    <span className="control-label">Radius: {radius}</span>
                    <span className="control-description">Size of the blur kernel</span>
                    <input
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