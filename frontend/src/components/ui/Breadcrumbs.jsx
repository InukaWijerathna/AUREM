import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-1.5 mb-6 md:mb-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          {index > 0 && (
            <ChevronRight className="w-3 h-3 text-sand-gold shrink-0" strokeWidth={1.5} />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="text-xs tracking-[0.14em] uppercase font-sans font-medium text-mid-gold hover:text-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-xs tracking-[0.14em] uppercase font-sans font-semibold text-espresso">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
