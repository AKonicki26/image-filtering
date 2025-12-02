import { useState, useEffect } from 'react';
import { HueRotateFilter } from './HueRotateFilter';
import './HueRotate.css';

interface HueRotateControlsProps {
    filter: HueRotateFilter;
    onChange?: () => void;
}

function HueRotateControls({ filter, onChange }: HueRotateControlsProps) {
    const [degrees, setDegrees] = useState(filter.degrees);

    useEffect(() => {
        setDegrees(filter.degrees);
    }, [filter]);

    const handleDegreesChange = (value: number) => {
        setDegrees(value);
        filter.degrees = value;
        onChange?.();
    };

    return (
        <div className="hue-rotate-controls">
            <h3>Hue Rotation Settings</h3>
            <div className="control-group">
                <label>
                    <span className="control-label">Rotation: {degrees}°</span>
                    <span className="control-description">Rotate colors around the color wheel</span>
                    <input
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