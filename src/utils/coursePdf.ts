import { Course } from '../types';

const ACCENTS: Record<string, string> = {
  a: 'àâä', e: 'éèêë', i: 'îï', o: 'ôö', u: 'ùûü', c: 'ç'
};

function stripAccents(value: string): string {
  let result = value;
  for (const plain of Object.keys(ACCENTS)) {
    for (const accented of ACCENTS[plain]) {
      result = result.split(accented).join(plain);
    }
  }
  return result;
}

function slugify(course: Course): string {
  return stripAccents(course.title.toLowerCase())
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || course.id;
}

/** True when the teacher has uploaded a real PDF file for this course, instead of the placeholder link. */
export function hasRealPdf(course: Course): boolean {
  return course.pdfUrl.startsWith('data:application/pdf') || course.pdfUrl.startsWith('http');
}

/** True for the legacy base64-embedded PDFs, which need blob-URL conversion before opening (see below). */
export function isDataUrlPdf(course: Course): boolean {
  return course.pdfUrl.startsWith('data:application/pdf');
}

export function getCourseDownloadFilename(course: Course): string {
  return `${slugify(course)}.${hasRealPdf(course) ? 'pdf' : 'txt'}`;
}

/**
 * Converts a base64 data: URL into an in-memory blob: URL.
 * Chromium-based browsers (Chrome, Brave, Edge) block top-level navigation to
 * data: URLs for security reasons, which leaves "Visualiser le PDF" showing a
 * blank tab. blob: URLs are exempt from that restriction and open normally.
 * Caller is responsible for revoking the URL (URL.revokeObjectURL) once done.
 */
export function dataUrlToBlobUrl(dataUrl: string): string {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/data:(.*);base64/)?.[1] || 'application/octet-stream';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

/**
 * Forces a real download (instead of an in-browser preview) for a Cloudinary URL.
 * The HTML `download` attribute is ignored by browsers for cross-origin links,
 * so we rely on Cloudinary's own `fl_attachment` delivery flag instead.
 */
export function getCloudinaryDownloadUrl(url: string, filename: string): string {
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
  return `${url.slice(0, idx + marker.length)}fl_attachment:${encodeURIComponent(nameWithoutExt)}/${url.slice(idx + marker.length)}`;
}

export function getCourseDownloadHref(course: Course): string {
  if (hasRealPdf(course)) return course.pdfUrl;

  const content = [
    course.title,
    `Niveau : ${course.level} — Matière : ${course.subject}`,
    `Publié le ${course.publishDate} • ${course.fileSize}`,
    '',
    course.description,
    '',
    `Tags : ${course.tags.join(', ')}`
  ].join('\n');
  return `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
}
