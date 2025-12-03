import { useState, useEffect, useRef } from 'react';
import { SharpenFilter } from './SharpenFilter';
import './Sharpen.css';

interface SharpenControlsProps {
    filter: SharpenFilter;
    onChange?: () => void;
}

function SharpenControls({ filter, onChange }: SharpenControlsProps) {
    const [amount, setAmount] = useState(filter.amount);
    const amountRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        setAmount(filter.amount);
    }, [filter]);

    // Update slider background based on value (instant)
    useEffect(() => {
        if (amountRef.current) {
            const percentage = ((amount - 0) / (3 - 0)) * 100;
            amountRef.current.style.setProperty('--value-percentage', `${percentage}%`);
        }
    }, [amount]);

    const handleAmountChange = (value: number) => {
        setAmount(value);
        filter.amount = value;

        // Debounce the actual filter application
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onChange?.();
        }, 150);
    };

    return (
        <div className="sharpen-controls">
            <h3>Sharpen Settings</h3>
            <div className="control-group">
                <label>
                    <span className="control-label">Amount: {amount.toFixed(1)}</span>
                    <span className="control-description">Intensity of edge enhancement</span>
                    <input
                        ref={amountRef}
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