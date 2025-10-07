import client from "../client";

export type RNFile = { uri: string; name: string; type: string };

type UploadResponse = {
  code: string;        // "200"
  message: string;     // "Image uploaded sucessfully"
  images: string[];    // URLs
};

export async function uploadMobileImages(mobileId: number, files: RNFile[]) {
  const form = new FormData();
  files.forEach((f) => {
    form.append("files", {
      uri: f.uri,
      name: f.name,
      type: f.type,
    } as any);
  });

  const res = await client.post<UploadResponse>(
    `/api/v1/mobile-images/${mobileId}/upload`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data.images; // keep return type as string[] for the screen
}
