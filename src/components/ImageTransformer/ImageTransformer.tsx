import { useState, useRef, useEffect, type ChangeEvent, useCallback } from 'react';
import './ImageTransformer.css';
import {
    type IImageFilter,
    GaussianBlurFilter,
    BlackAndWhiteFilter,
    HueRotateFilter,
    SharpenFilter,
    SaturationFilter,
    NoiseReductionFilter
} from '../../filters';
import { type FilterLayer, createFilterLayer } from '../../filters/FilterLayer';
import LayerPanel from '../LayerPanel/LayerPanel';

export default function ImageTransformer() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
    const [filteredImage, setFilteredImage] = useState<string | null>(null);
    const [filterLayers, setFilterLayers] = useState<FilterLayer[]>([]);
    const [expandedLayerId, setExpandedLayerId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Available filter templates for creating new layers
    const availableFilters: IImageFilter[] = [
        new GaussianBlurFilter(),
        new BlackAndWhiteFilter(),
        new HueRotateFilter(),
        new SharpenFilter(),
        new SaturationFilter(),
        new NoiseReductionFilter(),
    ];

    // Load image and convert to ImageData
    const loadImageData = useCallback((src: string): Promise<ImageData> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                resolve(imageData);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = src;
        });
    }, []);

    // Convert ImageData to data URL
    const imageDataToDataURL = useCallback((imageData: ImageData): string => {
        const canvas = document.createElement('canvas');
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    }, []);

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const result = e.target?.result as string;
                setUploadedImage(result);
                setFilterLayers([]);
                setExpandedLayerId(null);
                setFilteredImage(null);

                // Load image data for processing
                try {
                    const imageData = await loadImageData(result);
                    setOriginalImageData(imageData);
                } catch (error) {
                    console.error('Error loading image:', error);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleClearImage = () => {
        setUploadedImage(null);
        setOriginalImageData(null);
        setFilteredImage(null);
        setFilterLayers([]);
        setExpandedLayerId(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Apply all filter layers sequentially
    const applyFilterLayers = useCallback(async () => {
        if (!originalImageData || filterLayers.length === 0) {
            setFilteredImage(null);
            return;
        }

        setIsProcessing(true);

        try {
            // Start with original image data
            let output = originalImageData;

            // Apply each enabled layer in sequence
            for (const layer of filterLayers) {
                if (layer.enabled) {
                    output = layer.filter.apply(output);
                }
            }

            const dataURL = imageDataToDataURL(output);
            setFilteredImage(dataURL);
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [originalImageData, filterLayers, imageDataToDataURL]);

    // Add a new filter layer
    const handleAddFilter = (filterTemplate: IImageFilter) => {
        const newLayer = createFilterLayer(filterTemplate, filterLayers.length);
        setFilterLayers(prev => [...prev, newLayer]);
        setExpandedLayerId(newLayer.id);
    };

    // Toggle layer enabled/disabled
    const handleToggleLayer = (layerId: string) => {
        setFilterLayers(prev =>
            prev.map(layer =>
                layer.id === layerId
                    ? { ...layer, enabled: !layer.enabled }
                    : layer
            )
        );
    };

    // Delete a layer
    const handleDeleteLayer = (layerId: string) => {
        setFilterLayers(prev => prev.filter(layer => layer.id !== layerId));
        if (expandedLayerId === layerId) {
            setExpandedLayerId(null);
        }
    };

    // Move layer up or down
    const handleMoveLayer = (layerId: string, direction: 'up' | 'down') => {
        setFilterLayers(prev => {
            const index = prev.findIndex(layer => layer.id === layerId);
            if (index === -1) return prev;

            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= prev.length) return prev;

            const newLayers = [...prev];
            [newLayers[index], newLayers[newIndex]] = [newLayers[index], newLayers[newIndex]];
            return newLayers;
        });
    };

    // Toggle expanded layer
    const handleToggleExpanded = (layerId: string) => {
        setExpandedLayerId(prev => prev === layerId ? null : layerId);
    };

    // Re-apply filters when layers change or filter settings change
    useEffect(() => {
        if (filterLayers.length > 0) {
            applyFilterLayers();
        } else {
            setFilteredImage(null);
        }
    }, [filterLayers, applyFilterLayers]);

    return (
        <div className="image-transformer">
            <h1>Image Filter Tool</h1>

            <div className="upload-section">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />

                <button
                    className="upload-button"
                    onClick={handleButtonClick}
                >
                    Choose Image
                </button>

                {uploadedImage && (
                    <button
                        className="clear-button"
                        onClick={handleClearImage}
                    >
                        Clear Image
                    </button>
                )}
            </div>

            {uploadedImage && (
                <>
                    <div className="filter-controls">
                        <h2>Add Filters</h2>
                        <div className="filter-buttons">
                            {availableFilters.map(filter => (
                                <button
                                    key={filter.id}
                                    className="filter-btn"
                                    onClick={() => handleAddFilter(filter)}
                                    title={filter.description}
                                >
                                    + {filter.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <LayerPanel
                        layers={filterLayers}
                        expandedLayerId={expandedLayerId}
                        onToggleLayer={handleToggleLayer}
                        onDeleteLayer={handleDeleteLayer}
                        onMoveLayer={handleMoveLayer}
                        onToggleExpanded={handleToggleExpanded}
                        onFilterChange={applyFilterLayers}
                    />

                    <div className="image-display">
                        <div className="image-container">
                            <h2>Original Image</h2>
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="processed-image"
                            />
                        </div>

                        {filterLayers.length > 0 && (
                            <div className="image-container">
                                <h2>Filtered Image</h2>
                                {isProcessing ? (
                                    <div className="loading">Processing...</div>
                                ) : filteredImage ? (
                                    <img
                                        src={filteredImage}
                                        alt="Filtered"
                                        className="processed-image"
                                    />
                                ) : null}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}