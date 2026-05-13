import { useCallback, useState } from 'react';

import { uploadImageToCloudinary, type UploadedImage } from './cloudinary-client';

type UploadState = {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploaded: UploadedImage[];
};

export function useImageUpload(token: string | null | undefined, folder = 'luxury-cnc') {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    uploaded: [],
  });

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!token) {
        throw new Error('You must be signed in before uploading images.');
      }

      setState((current) => ({ ...current, uploading: true, progress: 0, error: null }));

      try {
        const uploaded: UploadedImage[] = [];
        for (let index = 0; index < files.length; index += 1) {
          const image = await uploadImageToCloudinary({
            token,
            file: files[index],
            folder,
            onProgress: (progress) => {
              const totalProgress = Math.round(((index + progress / 100) / files.length) * 100);
              setState((current) => ({ ...current, progress: totalProgress }));
            },
          });
          uploaded.push(image);
        }

        setState((current) => ({
          ...current,
          uploading: false,
          progress: 100,
          uploaded: [...current.uploaded, ...uploaded],
        }));

        return uploaded;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to upload images.';
        setState((current) => ({ ...current, uploading: false, error: message }));
        throw error;
      }
    },
    [folder, token],
  );

  const resetUploads = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null, uploaded: [] });
  }, []);

  return {
    ...state,
    uploadFiles,
    resetUploads,
  };
}
