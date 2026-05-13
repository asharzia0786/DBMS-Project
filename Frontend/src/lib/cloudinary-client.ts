import { getUploadSignature } from './api';

export type UploadedImage = {
  url: string;
  publicId: string;
  originalFilename: string;
};

type UploadOptions = {
  token: string;
  file: File;
  folder?: string;
  onProgress?: (progress: number) => void;
};

export async function uploadImageToCloudinary({
  token,
  file,
  folder = 'luxury-cnc',
  onProgress,
}: UploadOptions): Promise<UploadedImage> {
  const signature = await getUploadSignature(token, folder);
  const formData = new FormData();

  formData.append('file', file);
  formData.append('api_key', signature.apiKey);
  formData.append('timestamp', String(signature.timestamp));
  formData.append('signature', signature.signature);
  formData.append('folder', signature.folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText) as {
          secure_url?: string;
          public_id?: string;
          original_filename?: string;
          error?: { message?: string };
        };

        if (xhr.status >= 200 && xhr.status < 300 && body.secure_url && body.public_id) {
          resolve({
            url: body.secure_url,
            publicId: body.public_id,
            originalFilename: body.original_filename || file.name,
          });
          return;
        }

        reject(new Error(body.error?.message || 'Cloudinary upload failed.'));
      } catch {
        reject(new Error('Cloudinary upload returned an invalid response.'));
      }
    };

    xhr.onerror = () => reject(new Error('Unable to upload image.'));
    xhr.send(formData);
  });
}
