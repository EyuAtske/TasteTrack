import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

/**
 * Image picker with previews.
 *
 * - onChange(files)          -> newly selected File objects (array when `multiple`, else one File / null)
 * - onExistingChange(kept)   -> OPTIONAL. Called with the URLs of the already-saved images
 *                               (initialImages) that are still kept after the user clicks the X
 *                               on one of them. Use it to work out which saved photos to delete.
 */
export default function ImageUploadInput({
  multiple = false,
  maxFiles = 5,
  initialImages = [],
  onChange,
  onExistingChange,
  label = 'Upload Images',
}) {
  const [existing, setExisting] = useState(toArray(initialImages)); // saved image URLs
  const [selectedFiles, setSelectedFiles] = useState([]); // new File objects
  const [filePreviews, setFilePreviews] = useState([]); // object URLs of the new files

  // When the saved images change (e.g. after saving), reset to what is stored now.
  const initialKey = JSON.stringify(toArray(initialImages));
  useEffect(() => {
    setExisting(toArray(initialImages));
    setSelectedFiles([]);
    setFilePreviews([]);
  }, [initialKey]);

  const handleFileChange = (files) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    const updatedFiles = multiple
      ? [...selectedFiles, ...validFiles].slice(0, maxFiles)
      : [validFiles[0]];

    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));

    // Single-image mode: a new file replaces the saved one
    if (!multiple && existing.length > 0) {
      setExisting([]);
      if (onExistingChange) onExistingChange([]);
    }

    if (onChange) {
      onChange(multiple ? updatedFiles : updatedFiles[0]);
    }
  };

  const handleRemove = (index) => {
    if (index < existing.length) {
      // Removing an already-saved photo
      const kept = existing.filter((_, i) => i !== index);
      setExisting(kept);
      if (onExistingChange) onExistingChange(kept);
      if (!multiple && onChange) onChange(null);
      return;
    }

    // Removing a newly selected (not yet uploaded) photo
    const fileIndex = index - existing.length;
    const updatedFiles = selectedFiles.filter((_, i) => i !== fileIndex);
    const updatedPreviews = filePreviews.filter((_, i) => i !== fileIndex);

    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedPreviews);

    if (onChange) {
      onChange(multiple ? updatedFiles : updatedFiles[0] || null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const previews = [...existing, ...filePreviews];

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[11px] font-bold text-[#222222] uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative border-2 border-dashed border-[#DDDDDD] hover:border-[#222222] bg-[#F7F7F7] hover:bg-neutral-100/80 rounded-2xl p-4 text-center transition cursor-pointer group"
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={(e) => e.target.files && handleFileChange(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="flex flex-col items-center justify-center gap-1.5 py-2">
          <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#DDDDDD] flex items-center justify-center text-[#FF385C] group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#222222]">Click to upload</span> or drag and drop
          </div>
          <p className="text-[10px] text-[#717171]">
            PNG, JPG, or WEBP (max {multiple ? `${maxFiles} photos` : '5MB'})
          </p>
        </div>
      </div>

      {/* Image Previews Grid (saved photos first, then new ones) */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
          {previews.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-square rounded-xl overflow-hidden border border-[#DDDDDD] bg-[#EBEBEB] group shadow-xs"
            >
              <img src={src} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition cursor-pointer z-20"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}