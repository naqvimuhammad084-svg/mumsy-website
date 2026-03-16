'use client';

const WHATSAPP_URL =
  'https://wa.me/923032379096?text=Hi%20I%20would%20like%20a%20private%20consultation%20about%20EILIYAH%20products';

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.25)] hover:bg-[#20BD5A] transition font-medium text-sm border border-white/20 animate-[float-soft_10s_ease-in-out_infinite]"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white/70 opacity-75 animate-[ring-pulse-soft_1.7s_ease-out_infinite]" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      WhatsApp Consultation
    </a>
  );
}

