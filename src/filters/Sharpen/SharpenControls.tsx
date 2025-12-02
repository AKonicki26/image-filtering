import { useState, useEffect } from 'react';
import { SharpenFilter } from './SharpenFilter';
import './Sharpen.css';

interface SharpenControlsProps {
    filter: SharpenFilter;
    onChange?: () => void;
}

function SharpenControls({ filter, onChange }: SharpenControlsProps) {
    const [amount, setAmount] = useState(filter.amount);

    useEffect(() => {
        setAmount(filter.amount);
    }, [filter]);

    const handleAmountChange = (value: number) => {
        setAmount(value);
        filter.amount = value;
        onChange?.();
    };

    return (
        <div className="sharpen-controls">
            <h3>Sharpen Settings</h3>
            <div className="control-group">
                <label>
                    <span className="control-label">Amount: {amount.toFixed(1)}</span>
                    <span className="control-description">Intensity of edge enhancement</span>
                    <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={amount}
                        onChange={(e) => handleAmountChange(Number(e.target.value))}
                        className="range-slider"
                    />
                </label>
            </div>
        </div>
    );
}

// Factory function to create the component
export function createSharpenControls(
    filter: SharpenFilter,
    onChange?: () => void
): React.ReactNode {
    return <SharpenControls filter={filter} onChange={onChange} />;
}

export default SharpenControls;