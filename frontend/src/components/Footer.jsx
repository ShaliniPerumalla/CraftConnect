import { Link } from 'react-router-dom';
import { Mail, AtSign, Globe } from 'lucide-react';

const columns = [
  {
    title: 'Quick links',
    links: [
      { label: 'Explore crafts', to: '/explore' },
      { label: 'Categories', to: '/categories' },
      { label: 'Creators', to: '/creators' },
      { label: 'Custom orders', to: '/requirements' },
    ],
  },
  {
    title: 'For creators',
    links: [
      { label: 'Become a creator', to: '/register' },
      { label: 'Creator dashboard', to: '/creator-dashboard' },
      { label: 'Pricing your work', to: '/register' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', to: '/' },
      { label: 'Shipping & returns', to: '/' },
      { label: 'Trust & safety', to: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-display italic text-2xl text-cream">
                Craft
              </span>

              <span className="font-display font-semibold text-2xl text-amber -ml-2">
                Connect
              </span>
            </div>

            <p className="text-sm mt-4 max-w-xs leading-relaxed">
              Turn your love for handmade goods into a real connection with
              the people who make them. Discover pieces you'll keep.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <a
                href="mailto:hello@craftconnect.com"
                aria-label="Email"
                className="p-2.5 rounded-full border border-cream/20 hover:border-amber hover:text-amber transition-colors"
              >
                <Mail size={16} />
              </a>

              <button
                aria-label="Instagram"
                className="p-2.5 rounded-full border border-cream/20 hover:border-amber hover:text-amber transition-colors"
              >
                <AtSign size={16} />
              </button>

              <button
                aria-label="Website"
                className="p-2.5 rounded-full border border-cream/20 hover:border-amber hover:text-amber transition-colors"
              >
                <Globe size={16} />
              </button>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-cream font-medium text-sm">
                {col.title}
              </h4>

              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-amber transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-cream font-medium text-sm">Contact</h4>

            <ul className="mt-4 space-y-3 text-sm">
              <li>hello@craftconnect.com</li>
              <li>Mon–Fri, 9am–6pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>
            &copy; {new Date().getFullYear()} CraftConnect.
            Made with care, sold by hand.
          </p>

          <div className="flex gap-6">
            <Link to="/" className="hover:text-cream/80">
              Privacy
            </Link>

            <Link to="/" className="hover:text-cream/80">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
