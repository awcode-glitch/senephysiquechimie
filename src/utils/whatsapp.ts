export const WHATSAPP_NUMBER = '221772037193';
export const WHATSAPP_DISPLAY = '+221 77 203 71 93';

export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
