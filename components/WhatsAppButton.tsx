'use client';

const WHATSAPP_URL =
  'https://wa.me/923032379096?text=Hi%20I%20would%20like%20a%20private%20consultation%20about%20EILIYAH%20products';

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-2.5 shadow-lg hover:bg-[#20BD5A] transition font-medium text-sm border border-white/20"
    >
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      WhatsApp Consultation
    </a>
  );
}

