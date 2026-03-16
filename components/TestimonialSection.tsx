const testimonials = [
  {
    name: 'Ayesha, 32',
    text: 'I wanted something gentle that still made me feel more confident. MUMSY has become part of my nightly routine.',
    badge: 'Verified customer'
  },
  {
    name: 'Leila, 28',
    text: 'The texture is so soft and non-sticky. I love how it feels and the fact that the packaging is so discreet.',
    badge: 'Sensitive skin'
  },
  {
    name: 'Mariam, 37',
    text: 'I appreciate the clear, honest language. No heavy claims—just products that respect my body.',
    badge: 'Returning customer'
  }
];

export function TestimonialSection() {
  return (
    <section className="relative mt-16">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-r from-mumsy-purple/10 via-transparent to-mumsy-purple/10 blur-3xl" />
      <div className="container-page">
      <div className="rounded-3xl bg-gradient-to-r from-mumsy-purple to-mumsy-dark text-white px-6 py-10 sm:px-10 sm:py-12 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-md">
            <p className="text-xs uppercase tracking-[0.2em] text-mumsy-soft/80">
              REAL WOMEN • REAL STORIES
            </p>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl">
              Created to support your quiet, everyday confidence.
            </h2>
            <p className="mt-3 text-sm text-mumsy-soft/90">
              From postpartum journeys to everyday self-care, MUMSY is here to
              support you with gentle, private routines that fit your life.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 flex-1">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="rounded-2xl bg-white/12 backdrop-blur-lg p-4 text-sm transition-transform duration-300 hover:-translate-y-1.5 hover:bg-white/18"
              >
                <p className="text-mumsy-soft/95">{t.text}</p>
                <p className="mt-3 font-semibold">{t.name}</p>
                <p className="text-xs text-mumsy-soft/80">{t.badge}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

