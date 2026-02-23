'use client';

import React, { useCallback, useState } from 'react';

import { ImageIcon } from 'lucide-react';

interface PhotoUploadStepProps {
  onPhotosSelected: (files: File[]) => void;
}

export function PhotoUploadStep({ onPhotosSelected }: PhotoUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith('image/'),
      );

      if (imageFiles.length === 0) {
        alert('Please select image files only');
        return;
      }

      // Create preview URLs
      const urls = imageFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);

      // Proceed to next step
      onPhotosSelected(imageFiles);
    },
    [onPhotosSelected],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles],
  );

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          id="photo-upload"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <label
          htmlFor="photo-upload"
          className="flex cursor-pointer flex-col items-center gap-4"
        >
          <div className="bg-primary/10 rounded-full p-4">
            <ImageIcon className="text-primary size-8" />
          </div>
          <div>
            <p className="text-lg font-medium">
              Drop photos here or click to browse
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Upload one or multiple photos of your item
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          ></input>
        </label>
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg border"
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
