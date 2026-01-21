"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/axios";

interface ImageUploadProps {
  projectId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  projectId,
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImages = async (files: File[]) => {
    const remainingSlots = maxImages - images.length;

    if (remainingSlots === 0) {
      setUploadError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    setUploading(true);
    setUploadError(null);

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const response = await fetch(
          `${apiUrl}/projects/${projectId}/images/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("satoru_admin_token")}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Error al subir la imagen");
        }

        const project = await response.json();
        onImagesChange(project.images || []);
      } catch (error) {
        console.error(`Error uploading image ${i + 1}:`, error);
        setUploadError(`Error al subir ${file.name}. Continuando con las demás...`);
      }
    }

    setUploading(false);
    if (filesToUpload.length < files.length) {
      setUploadError(`Solo se subieron ${filesToUpload.length} imágenes (límite alcanzado)`);
    }
  };

  const deleteImage = async (imageUrl: string) => {
    const filename = imageUrl.split("/").pop();
    if (!filename) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(
        `${apiUrl}/projects/${projectId}/images/${filename}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("satoru_admin_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la imagen");
      }

      const project = await response.json();
      onImagesChange(project.images || []);
    } catch (error) {
      console.error("Error deleting image:", error);
      setUploadError("Error al eliminar la imagen");
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length > 0) {
        uploadImages(imageFiles);
      }
    },
    [projectId, images]
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
      uploadImages(Array.from(files));
    }
    // Reset input value to allow selecting the same files again
    e.target.value = "";
  };

  const getImageFullUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("http")) return imageUrl;
    // Remove /api from the URL since static files are served from root
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}${imageUrl}`;
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
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-[#FF4400]" size={40} />
            ) : (
              <Upload className="text-gray-600" size={40} />
            )}
            <div>
              <p className="text-white font-bold text-sm">
                {uploading
                  ? "Subiendo imágenes..."
                  : "Arrastra imágenes o haz click para seleccionar"}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                JPG, PNG o WEBP. Máximo 5MB por imagen.
              </p>
              <p className="text-gray-600 text-xs">
                Puedes seleccionar múltiples archivos a la vez.
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-500 text-sm">
          {uploadError}
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden bg-[#0A0A0A] border border-gray-800"
            >
              <img
                src={getImageFullUrl(imageUrl)}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => deleteImage(imageUrl)}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Images Count */}
      {images.length > 0 && (
        <p className="text-xs text-gray-600 text-center">
          {images.length} de {maxImages} imágenes
        </p>
      )}
    </div>
  );
}
