const tips = [
  {
    title: 'Designed for the outer intimate area only',
    body: 'MUMSY products are created for the vulva (outer skin) and bikini line. They are not meant for internal use.'
  },
  {
    title: 'Gentle, consistent care works best',
    body: 'Think of intimate brightening like a skincare routine. Mild formulas used regularly are kinder to skin than harsh, fast-acting treatments.'
  },
  {
    title: 'Listen to your skin',
    body: 'If you notice irritation, redness, or discomfort, pause use and speak with your healthcare provider for personalised advice.'
  }
];

export function EducationSection() {
  return (
    <section
      id="education"
      className="container-page mt-16 grid md:grid-cols-[1.1fr,1fr] gap-8 items-start"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">
          INTIMATE CARE EDUCATION
        </p>
        <h2 className="mt-2 font-heading text-2xl sm:text-3xl text-mumsy-dark">
          A kinder, more honest way to talk about intimate brightening.
        </h2>
        <p className="mt-3 text-sm text-mumsy-dark/80 max-w-xl">
          Intimate skin naturally changes over time—through hormones, shaving,
          pregnancy, and everyday life. MUMSY focuses on comfort, hydration, and
          a more even-looking tone without promising instant transformations or
          medical outcomes.
        </p>
      </div>
      <div className="space-y-3">
        {tips.map((tip) => (
          <article
            key={tip.title}
            className="rounded-2xl bg-white border border-mumsy-lavender/40 p-4"
          >
            <h3 className="font-semibold text-sm text-mumsy-dark">
              {tip.title}
            </h3>
            <p className="mt-1 text-xs text-mumsy-dark/75">{tip.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

