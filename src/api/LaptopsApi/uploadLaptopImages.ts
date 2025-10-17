// src/api/LaptopsApi/uploadImages.ts
import client from '../client';

export type RNFile = { uri: string; name: string; type: string };

export type UploadLaptopImagesResponse = {
  status?: string;
  message?: string;
  code?: string;
  statusCode?: number;
  imageUrls?: string[]; // if backend returns uploaded urls
  [k: string]: any;
};

/**
 * Upload 1..N photos for a given laptop.
 * Endpoint: /api/photo/upload?laptopId={id}
 * NOTE: Field name "files" matches how mobile upload usually works;
 * if your mobile file used "file" singular, just change 'files' to 'file' below.
 */
export async function uploadLaptopImages(
  laptopId: number,
  files: RNFile[],
): Promise<UploadLaptopImagesResponse> {
  const form = new FormData();

  files.forEach((f, idx) => {
    form.append('files', {
      // @ts-ignore React Native FormData type
      uri: f.uri,
      name: f.name || `laptop_${laptopId}_${idx}.jpg`,
      type: f.type || 'image/jpeg',
    });
  });

  const { data } = await client.post<UploadLaptopImagesResponse>(
    `/api/photo/upload?laptopId=${encodeURIComponent(laptopId)}`,
    form,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // If your backend needs cookies/auth headers, your axios client already handles it
    },
  );

  return data;
}
