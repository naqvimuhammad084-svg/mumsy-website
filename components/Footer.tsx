export function Footer() {
  return (
    <footer className="border-t border-mumsy-lavender/40 mt-16 bg-white/70">
      <div className="container-page py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-mumsy-dark/70">
        <div>
          <p className="font-heading text-base text-mumsy-dark">
            EILIYAH Intimate Care
          </p>
          <p className="mt-1 max-w-md">
            Gentle, supportive feminine-care essentials designed to protect your
            comfort and confidence—always with discretion.
          </p>
        </div>
        <div className="space-y-1">
          <p>Privacy Policy • Terms &amp; Conditions</p>
          <p>Shipping &amp; Returns • Discreet Packaging</p>
          <p className="text-xs text-mumsy-dark/60">
            This website does not provide medical advice. Always consult your
            healthcare provider for personal guidance.
          </p>
        </div>
      </div>
    </footer>
  );
}

