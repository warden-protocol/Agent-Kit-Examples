"use client";

import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { RiImageAddLine } from "@remixicon/react";

interface MultiImagePickerProps {
  onImagesPick: (images: string[]) => void;
  disabled?: boolean;
}

export default function MultiImagePicker({ onImagesPick, disabled }: MultiImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      const imagePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);
      onImagesPick(base64Images);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing images:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
        disabled={disabled}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="ghost"
        size="icon"
        className="shrink-0 rounded-full"
        disabled={disabled}
      >
        <RiImageAddLine className="w-5 h-5" />
      </Button>
    </div>
  );
}