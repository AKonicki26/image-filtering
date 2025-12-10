import type { FilterLayer } from '../../filters/FilterLayer';
import './LayerPanel.css';

interface LayerPanelProps {
    layers: FilterLayer[];
    expandedLayerId: string | null;
    onToggleLayer: (layerId: string) => void;
    onDeleteLayer: (layerId: string) => void;
    onMoveLayer: (layerId: string, direction: 'up' | 'down') => void;
    onToggleExpanded: (layerId: string) => void;
    onFilterChange: () => void;
}

export default function LayerPanel({
                                       layers,
                                       expandedLayerId,
                                       onToggleLayer,
                                       onDeleteLayer,
                                       onMoveLayer,
                                       onToggleExpanded,
                                       onFilterChange
                                   }: LayerPanelProps) {
    return (
        <div className="layer-panel">
            <h3>Filter Layers</h3>
            {layers.length === 0 ? (
                <div className="empty-layers">
                    <p>No filters applied yet. Add a filter to get started!</p>
                </div>
            ) : (
                <div className="layers-list">
                    {layers.map((layer, index) => (
                        <div
                            key={layer.id}
                            className={`layer-item ${!layer.enabled ? 'disabled' : ''}`}
                        >
                            <div className="layer-header">
                                <div className="layer-controls-left">
                                    <button
                                        className="layer-toggle"
                                        onClick={() => onToggleLayer(layer.id)}
                                        title={layer.enabled ? 'Disable layer' : 'Enable layer'}
                                    >
                                        {layer.enabled ? '👁️' : '🚫'}
                                    </button>
                                    <span className="layer-name">{layer.name}</span>
                                </div>

                                <div className="layer-controls-right">
                                    <button
                                        className="layer-reorder"
                                        onClick={() => onMoveLayer(layer.id, 'up')}
                                        disabled={index === 0}
                                        title="Move up"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        className="layer-reorder"
                                        onClick={() => onMoveLayer(layer.id, 'down')}
                                        disabled={index === layers.length - 1}
                                        title="Move down"
                                    >
                                        ▼
                                    </button>
                                    <button
                                        className="layer-expand"
                                        onClick={() => onToggleExpanded(layer.id)}
                                        title="Toggle settings"
                                    >
                                        {expandedLayerId === layer.id ? '▼' : '▶'}
                                    </button>
                                    <button
                                        className="layer-delete"
                                        onClick={() => onDeleteLayer(layer.id)}
                                        title="Delete layer"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {expandedLayerId === layer.id && (
                                <div className="layer-settings">
                                    {layer.filter.getControls(onFilterChange)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}