import { useGetCategoriesQuery } from '../../redux/api/categoryApi';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-ratings', label: 'Top Rated' },
  { value: '-soldCount', label: 'Most Popular' },
];

export default function SidebarFilters({ filters, onChange, onReset }) {
  const { data: catData } = useGetCategoriesQuery();

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <aside className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="input text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => handleChange('category', '')}
              className="text-primary-600"
            />
            <span className="text-sm text-gray-700">All Categories</span>
          </label>
          {catData?.categories?.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat._id}
                onChange={() => handleChange('category', cat._id)}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="input text-sm w-full"
            min="0"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="input text-sm w-full"
            min="0"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Min Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === String(r)}
                onChange={() => handleChange('rating', String(r))}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-700">{r}+ stars</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={!filters.rating}
              onChange={() => handleChange('rating', '')}
              className="text-primary-600"
            />
            <span className="text-sm text-gray-700">Any rating</span>
          </label>
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => handleChange('inStock', e.target.checked ? 'true' : '')}
            className="text-primary-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">In Stock Only</span>
        </label>
      </div>

      <button onClick={onReset} className="btn-secondary w-full text-sm">
        Reset Filters
      </button>
    </aside>
  );
}
