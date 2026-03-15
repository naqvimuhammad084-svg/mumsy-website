import Link from 'next/link';

const sections = [
  { href: '/admin/ranges', label: 'Ranges management', desc: 'Create, edit, delete ranges' },
  { href: '/admin/products', label: 'Products management', desc: 'Add, edit, delete products' },
  { href: '/admin/bundles', label: 'Bundles management', desc: 'Create and edit bundles' },
  { href: '/admin/orders', label: 'Orders', desc: 'View customer orders' },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-mumsy-dark">Dashboard</h1>
      <p className="mt-1 text-sm text-mumsy-dark/70">
        Manage ranges, products, bundles, and view orders.
      </p>
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {sections.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="block rounded-2xl bg-white border border-mumsy-lavender/40 p-5 hover:border-mumsy-purple/50 hover:shadow-soft transition"
          >
            <h2 className="font-heading text-lg text-mumsy-dark">{label}</h2>
            <p className="mt-1 text-sm text-mumsy-dark/70">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
