const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB — Cloudinary's unsigned upload default cap

export function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Uploads a PDF to Cloudinary (unsigned preset) and returns its public URL. */
export async function uploadCoursePdf(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('resource_type', 'raw');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error("Échec de l'envoi du PDF vers Cloudinary");
  }

  const data = await response.json();
  return data.secure_url as string;
}
