'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { ImagePlus, X } from 'lucide-react';

import { cn } from './util/cn';

interface ImageUploadAreaProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles: number;
  className?: string;
}

export function ImageUploadArea({
  files,
  onFilesChange,
  maxFiles,
  className,
}: ImageUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canAddMore = files.length < maxFiles;

  const previewUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach(URL.revokeObjectURL);
    };
  }, [previewUrls]);

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const accepted = Array.from(incoming).filter((f) =>
        f.type.startsWith('image/'),
      );
      const remaining = maxFiles - files.length;
      const toAdd = accepted.slice(0, remaining);
      if (toAdd.length > 0) {
        onFilesChange([...files, ...toAdd]);
      }
    },
    [files, maxFiles, onFilesChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleRemove = useCallback(
    (index: number) => {
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange],
  );

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-input text-muted-foreground hover:border-primary/50 hover:text-foreground flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
        >
          <ImagePlus className="size-8 opacity-60" />
          <span className="text-sm">Click or drag images to upload</span>
          <span className="text-muted-foreground text-xs">
            {files.length} of {maxFiles} images
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {previewUrls.map((url, i) => (
            <div
              key={`${files[i]?.name}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={url}
                alt={files[i]?.name ?? `Image ${i + 1}`}
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="bg-background/80 text-foreground absolute top-1 right-1 rounded-full p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!canAddMore && files.length > 0 && (
        <p className="text-muted-foreground text-center text-xs">
          Maximum of {maxFiles} images reached
        </p>
      )}
    </div>
  );
}
