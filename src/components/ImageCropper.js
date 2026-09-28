import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        file.name = 'cropped.jpg';
        resolve(file);
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg', 0.95);
  });
}

export default function ImageCropper({ imageSrc, aspect = 1, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      // Convert Blob to File object to match existing pipeline
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay-bg" style={{ zIndex: 9999 }}>
      <div className="modal-dialog-box" style={{ maxWidth: '600px', width: '95%', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Adjust Image</h3>
          <button onClick={onCancel} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>
        
        <div style={{ position: 'relative', width: '100%', height: '400px', background: '#000' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
          />
        </div>
        
        <div style={{ padding: '16px 20px', background: '#F8FAFC', borderTop: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <ZoomOut size={16} color="var(--text-muted)" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              style={{ flex: 1, accentColor: 'var(--brand-primary)' }}
            />
            <ZoomIn size={16} color="var(--text-muted)" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={onCancel} className="btn-action-outline">Cancel</button>
            <button onClick={handleSave} className="btn-action-primary" disabled={isProcessing} style={{ minWidth: '120px' }}>
              {isProcessing ? 'Processing...' : <><Check size={16} /> Confirm Crop</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
