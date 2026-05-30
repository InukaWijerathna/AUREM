import { useGetCategoriesQuery } from '../../redux/api/categoryApi';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price',      label: 'Price: Low to High' },
  { value: '-price',     label: 'Price: High to Low' },
  { value: '-ratings',   label: 'Top Rated' },
  { value: '-soldCount', label: 'Most Popular' },
];

export default function SidebarFilters({ filters, onChange, onReset }) {
  const { data: catData } = useGetCategoriesQuery();

  const handleChange = (key, value) => onChange({ ...filters, [key]: value, page: 1 });

  const isCatSelected = (cat) =>
    filters.category === cat._id || filters.category === cat.slug;

  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice ||
    filters.rating || filters.inStock === 'true';

  return (
    <aside className="space-y-7">

      {/* Sort */}
      <div>
        <p className="sec-label">Sort By</p>
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="input w-full text-xs"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <p className="sec-label">Category</p>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => handleChange('category', '')}
              className="accent-primary-600 w-3.5 h-3.5 shrink-0"
            />
            <span className="text-xs font-sans tracking-wider text-espresso group-hover:text-primary-600 transition-colors">
              All Categories
            </span>
          </label>
          {catData?.categories?.map((cat) => (
            <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={isCatSelected(cat)}
                onChange={() => handleChange('category', cat._id)}
                className="accent-primary-600 w-3.5 h-3.5 shrink-0"
              />
              <span className="text-xs font-sans tracking-wider text-espresso group-hover:text-primary-600 transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="sec-label">Price Range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="input w-full text-xs"
            min="0"
          />
          <span className="text-mid-gold text-xs shrink-0">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="input w-full text-xs"
            min="0"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="sec-label">Min Rating</p>
        <div className="space-y-2.5">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === String(r)}
                onChange={() => handleChange('rating', String(r))}
                className="accent-primary-600 w-3.5 h-3.5 shrink-0"
              />
              <span className="text-xs font-sans tracking-wider text-espresso group-hover:text-primary-600 transition-colors">
                {r}+ stars
              </span>
            </label>
          ))}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="rating"
              checked={!filters.rating}
              onChange={() => handleChange('rating', '')}
              className="accent-primary-600 w-3.5 h-3.5 shrink-0"
            />
            <span className="text-xs font-sans tracking-wider text-espresso group-hover:text-primary-600 transition-colors">
              Any rating
            </span>
          </label>
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => handleChange('inStock', e.target.checked ? 'true' : '')}
            className="accent-primary-600 w-3.5 h-3.5 shrink-0"
          />
          <span className="text-xs font-sans tracking-wider text-espresso group-hover:text-primary-600 transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="w-full text-xs tracking-wider uppercase font-sans font-semibold text-claret border border-claret/40 py-2.5 hover:bg-claret hover:text-champagne transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
