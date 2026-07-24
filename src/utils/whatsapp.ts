export const WHATSAPP_NUMBER = '221772037193';
export const WHATSAPP_DISPLAY = '+221 77 203 71 93';

export const WHATSAPP_NUMBER_2 = '221765779996';
export const WHATSAPP_DISPLAY_2 = '+221 76 577 99 96';

export function getWhatsAppLink(message?: string, number: string = WHATSAPP_NUMBER): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
