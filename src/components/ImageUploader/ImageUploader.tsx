import { useState, useRef, type ChangeEvent } from 'react';
import './ImageUploader.css';

export default function ImageUploader() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const result = e.target?.result as string;
                setUploadedImage(result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleClearImage = () => {
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="image-uploader">
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
                <div className="image-display">
                    <div className="image-container">
                        <h2>Original Image</h2>
                        <img
                            src={uploadedImage}
                            alt="Uploaded"
                            className="uploaded-image"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}