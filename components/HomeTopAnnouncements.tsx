'use client';

import { useEffect, useMemo, useState } from 'react';

type SlideRow = {
  id: string;
  text?: string | null;
};

export function HomeTopAnnouncements() {
  const [messages, setMessages] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/slides');
        const data = (await res.json().catch(() => [])) as SlideRow[];
        if (!alive || !res.ok || !Array.isArray(data)) return;
        const list = data
          .map((s) => (typeof s?.text === 'string' ? s.text.trim() : ''))
          .filter(Boolean);
        setMessages(list);
      } catch {
        setMessages([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % messages.length), 3200);
    return () => clearInterval(t);
  }, [messages.length]);

  const active = useMemo(() => messages[idx] ?? '', [messages, idx]);
  if (!active) return null;

  return (
    <div className="container-page pt-4">
      <div className="rounded-2xl border border-mumsy-lavender/40 bg-white/70 backdrop-blur px-4 py-2.5 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <p key={idx} className="text-sm text-mumsy-dark/85">{active}</p>
      </div>
    </div>
  );
}

