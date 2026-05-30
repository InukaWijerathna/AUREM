import { Link } from 'react-router-dom';

const SHOP_LINKS = [
  { label: 'Timepieces',    slug: 'timepieces' },
  { label: 'Jewellery',     slug: 'jewellery' },
  { label: 'Leather Goods', slug: 'leather-goods' },
  { label: 'Accessories',   slug: 'accessories' },
  { label: 'Fragrance',     slug: 'fragrance' },
  { label: 'Gifting',       slug: 'gifting' },
];

const ACCOUNT_LINKS = [
  { label: 'My Profile', to: '/profile' },
  { label: 'My Orders',  to: '/orders'  },
  { label: 'Wishlist',   to: '/wishlist' },
  { label: 'Cart',       to: '/cart'    },
];

const HELP_LINKS = [
  { label: 'Contact Us',       to: '#' },
  { label: 'Shipping Policy',  to: '#' },
  { label: 'Returns',          to: '#' },
  { label: 'Authenticity',     to: '#' },
];

/* Inline social SVGs — no library required */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.641 1.267 1.408 0 .858-.546 2.14-.828 3.33-.236.994.499 1.806 1.476 1.806 1.772 0 3.138-1.867 3.138-4.562 0-2.386-1.715-4.054-4.163-4.054-2.836 0-4.498 2.127-4.498 4.326 0 .856.33 1.775.741 2.276a.3.3 0 01.069.285c-.076.315-.244.994-.277 1.134-.044.183-.146.222-.338.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
  </svg>
);

const SOCIALS = [
  { label: 'Instagram', Icon: InstagramIcon, href: '#' },
  { label: 'Pinterest', Icon: PinterestIcon, href: '#' },
  { label: 'WhatsApp',  Icon: WhatsAppIcon,  href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-espresso text-mid-gold mt-20 border-t border-sand-gold/20">

      {/* Main grid */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex flex-col items-start leading-none mb-5">
              <span className="font-display font-light text-2xl tracking-[0.38em] text-primary-300 leading-none">
                AUREM
              </span>
              <span className="text-[10px] tracking-[0.25em] text-mid-gold uppercase mt-1">
                Curated Luxury · Est. 2024
              </span>
            </Link>
            <p className="text-sm font-sans text-gray-400 leading-relaxed max-w-[220px]">
              A curated edit of the world's finest timepieces, jewellery, leather goods, and rare objects of desire.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 border border-sand-gold/30 flex items-center justify-center text-mid-gold hover:border-primary-300 hover:text-primary-300 transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="sec-label" style={{ color: '#A8926A' }}>Shop</p>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(({ label, slug }) => (
                <li key={slug}>
                  <Link
                    to={`/products?category=${slug}`}
                    className="text-sm font-sans text-gray-400 hover:text-primary-300 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="sec-label" style={{ color: '#A8926A' }}>Account</p>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm font-sans text-gray-400 hover:text-primary-300 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="sec-label" style={{ color: '#A8926A' }}>Client Services</p>
            <ul className="space-y-2.5">
              {HELP_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm font-sans text-gray-400 hover:text-primary-300 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-sand-gold/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs tracking-wider text-gray-400 font-sans font-medium uppercase">
            &copy; {new Date().getFullYear()} AUREM. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs tracking-wider text-gray-400 font-sans font-medium uppercase">
            <span>Secure Payments</span>
            <span className="text-sand-gold/30">·</span>
            <span>Authenticated Products</span>
            <span className="text-sand-gold/30">·</span>
            <span>Discreet Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
