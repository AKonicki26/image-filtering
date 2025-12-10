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

export default function ImageTransformer() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
    const [filteredImage, setFilteredImage] = useState<string | null>(null);
    const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Collection of available filters - this is where you add new filters!
    const [filters] = useState<IImageFilter[]>([
        new GaussianBlurFilter(),
        new BlackAndWhiteFilter(),
        new HueRotateFilter(),
        new SharpenFilter(),
        new SaturationFilter(),
        new NoiseReductionFilter(),
    ]);

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
                setActiveFilterId(null);
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
        setActiveFilterId(null);

        // Reset all filters
        filters.forEach(filter => filter.reset());

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const applyActiveFilter = useCallback(async () => {
        if (!originalImageData || !activeFilterId) {
            setFilteredImage(null);
            return;
        }

        const filter = filters.find(f => f.id === activeFilterId);
        if (!filter) {
            setFilteredImage(null);
            return;
        }

        setIsProcessing(true);

        try {
            // Apply the filter using the common interface
            const processedData = filter.apply(originalImageData);
            const dataURL = imageDataToDataURL(processedData);
            setFilteredImage(dataURL);
        } catch (error) {
            console.error('Error applying filter:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [originalImageData, activeFilterId, filters, imageDataToDataURL]);

    const handleFilterSelect = (filterId: string) => {
        setActiveFilterId(filterId);
    };

    const handleFilterChange = () => {
        // Re-apply filter when controls change
        applyActiveFilter();
    };

    // Apply filter when active filter changes
    useEffect(() => {
        if (activeFilterId) {
            applyActiveFilter();
        }
    }, [activeFilterId, applyActiveFilter]);

    const activeFilter = filters.find(f => f.id === activeFilterId);

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
                        <h2>Available Filters</h2>
                        <div className="filter-buttons">
                            <button
                                className={`filter-btn ${!activeFilterId ? 'active' : ''}`}
                                onClick={() => setActiveFilterId(null)}
                            >
                                No Filter
                            </button>
                            {filters.map(filter => (
                                <button
                                    key={filter.id}
                                    className={`filter-btn ${activeFilterId === filter.id ? 'active' : ''}`}
                                    onClick={() => handleFilterSelect(filter.id)}
                                    title={filter.description}
                                >
                                    {filter.name}
                                </button>
                            ))}
                        </div>

                        {activeFilter && (
                            <div className="filter-settings">
                                {activeFilter.getControls(handleFilterChange)}
                            </div>
                        )}
                    </div>

                    <div className="image-display">
                        <div className="image-container">
                            <h2>Original Image</h2>
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="processed-image"
                            />
                        </div>

                        {activeFilterId && (
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