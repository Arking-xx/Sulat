import { useState, useEffect } from 'react';

// Image preview hook
type useImagePreviewOption = {
  initialImage?: string;
  isBlogPost?: boolean; //optional
};
// option empty object, not causing an error if there's args been pass
export const useImagePreview = (option: useImagePreviewOption = {}) => {
  const { initialImage } = option;

  const [imagePreview, setImagePreview] = useState<string | undefined>(initialImage || undefined);

  useEffect(() => {
    if (initialImage) {
      setImagePreview(initialImage);
    }
  }, [initialImage]);

  useEffect(() => {
    return () => {
      if (imagePreview && !initialImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, initialImage]); // keeps looking on these data

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imagePreview && !initialImage) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(e.target.files![0]));
  };

  const handleRemove = () => {
    if (imagePreview && !initialImage) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(undefined);
  };

  const resetToInitial = () => {
    if (imagePreview && !initialImage) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(initialImage);
  };

  return {
    imagePreview,
    setImagePreview,
    handleChange,
    handleRemove,
    resetToInitial,
    hasLocalImage: !!imagePreview && !initialImage,
  };
};
