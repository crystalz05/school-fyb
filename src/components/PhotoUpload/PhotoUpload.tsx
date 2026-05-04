import React, { useRef, useState, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Props {
  onCropComplete: (base64: string) => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, 3 / 4, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

function getCroppedBase64(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<string> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas empty'));
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }, 'image/png');
  });
}

export function PhotoUpload({ onCropComplete }: Props) {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth < 400 || img.naturalHeight < 500) {
          setError(`Image too small (${img.naturalWidth}×${img.naturalHeight}px). Minimum is 400×500px.`);
          return;
        }
        setImgSrc(dataUrl);
        setShowCropper(true);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;
    try {
      const base64 = await getCroppedBase64(imgRef.current, completedCrop);
      setPreview(base64);
      onCropComplete(base64);
      setShowCropper(false);
    } catch {
      setError('Failed to crop image. Please try again.');
    }
  }, [completedCrop, onCropComplete]);

  return (
    <div className="photo-upload">
      <label className="photo-upload__label" htmlFor="photo-input">
        {preview ? (
          <img src={preview} alt="Preview" className="photo-upload__thumb" />
        ) : (
          <div className="photo-upload__placeholder">
            <span className="photo-upload__icon">📷</span>
            <span>Upload Photo</span>
            <span className="photo-upload__hint">Min 400×500px · 3:4 ratio</span>
          </div>
        )}
      </label>
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="photo-upload__input"
      />
      {preview && (
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => setShowCropper(true)}
        >
          Change Photo
        </button>
      )}
      {error && <p className="field-error">{error}</p>}

      {showCropper && imgSrc && (
        <div className="crop-modal" role="dialog" aria-modal="true" aria-label="Crop photo">
          <div className="crop-modal__content">
            <h2 className="crop-modal__title">Crop Your Photo</h2>
            <p className="crop-modal__hint">3:4 portrait ratio is locked.</p>
            <div className="crop-modal__canvas">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={3 / 4}
                minWidth={100}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop source"
                  onLoad={onImageLoad}
                  style={{ maxHeight: '60vh', maxWidth: '100%' }}
                />
              </ReactCrop>
            </div>
            <div className="crop-modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setShowCropper(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn--primary" onClick={handleConfirm}>
                Confirm Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
