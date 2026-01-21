"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadLocalProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export default function ImageUploadLocal({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploadLocalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImages = (files: File[]) => {
    const remainingSlots = maxImages - images.length;

    if (remainingSlots === 0) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const validFiles: File[] = [];
    let hasErrors = false;

    for (const file of files) {
      // Stop if we've reached the limit
      if (images.length + validFiles.length >= maxImages) {
        setError(`Solo se pueden agregar ${remainingSlots} imágenes más`);
        hasErrors = true;
        break;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(`${file.name}: Solo se permiten archivos de imagen`);
        hasErrors = true;
        continue;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name}: El archivo no debe superar 5MB`);
        hasErrors = true;
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      if (!hasErrors) {
        setError(null);
      }
      onImagesChange([...images, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length > 0) {
        addImages(imageFiles);
      }
    },
    [images, maxImages]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addImages(Array.from(files));
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const getImagePreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? "border-[#FF4400] bg-[#FF4400]/5"
              : "border-gray-800 hover:border-gray-700"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload-local"
          />
          <label
            htmlFor="image-upload-local"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <Upload className="text-gray-600" size={40} />
            <div>
              <p className="text-white font-bold text-sm">
                Arrastra imágenes o haz click para seleccionar
              </p>
              <p className="text-gray-600 text-xs mt-1">
                JPG, PNG o WEBP. Máximo 5MB por imagen. Puedes seleccionar múltiples archivos.
              </p>
              <p className="text-gray-600 text-xs">
                Las imágenes se subirán al crear el proyecto.
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((file, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden bg-[#0A0A0A] border border-gray-800"
            >
              <img
                src={getImagePreviewUrl(file)}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <p className="text-xs text-gray-300 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Images Count */}
      {images.length > 0 && (
        <p className="text-xs text-gray-600 text-center">
          {images.length} de {maxImages} imágenes seleccionadas
        </p>
      )}
    </div>
  );
}
