import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Search, Heart, ShoppingBag, User, ChevronDown, Menu, X,
} from 'lucide-react';
import { selectCurrentUser, selectIsLoggedIn, clearCredentials } from '../../redux/authSlice';
import { selectCartItemCount, toggleCart } from '../../redux/cartSlice';
import { useLogoutMutation } from '../../redux/api/authApi';
import SearchBar from '../products/SearchBar';

const CATEGORIES = [
  { label: 'Timepieces',    slug: 'timepieces' },
  { label: 'Jewellery',     slug: 'jewellery' },
  { label: 'Leather Goods', slug: 'leather-goods' },
  { label: 'Accessories',   slug: 'accessories' },
  { label: 'Fragrance',     slug: 'fragrance' },
  { label: 'Gifting',       slug: 'gifting' },
];

export default function Navbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const user       = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cartCount  = useSelector(selectCartItemCount);

  const [logout] = useLogoutMutation();
  const [menuOpen, setMenuOpen]               = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen]           = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate('/login');
      toast.success('You have been signed out.');
    } catch {
      dispatch(clearCredentials());
      navigate('/login');
    }
    setUserDropdownOpen(false);
  };

  return (
    <header className="bg-parchment border-b border-sand-gold/60 sticky top-0 z-40">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-2.5">
            <img
              src={logo}
              alt="AUREM"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display font-light text-xl tracking-[0.32em] text-primary-600">
                AUREM
              </span>
              <span className="text-[10px] tracking-[0.22em] text-mid-gold uppercase mt-0.5">
                Curated Luxury
              </span>
            </div>
          </Link>

          {/* Search — desktop */}
          <div className="hidden md:block flex-1 max-w-sm">
            <SearchBar />
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1">

            {/* Search toggle — mobile */}
            <button
              className="md:hidden p-2 text-primary-600 hover:text-primary-700 transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Wishlist */}
            {isLoggedIn && (
              <Link
                to="/wishlist"
                className="p-2 text-primary-600 hover:text-primary-700 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 text-primary-600 hover:text-primary-700 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-champagne text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-sans">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 hover:bg-sand-gold/20 transition-colors"
                >
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} referrerPolicy="no-referrer" className="w-7 h-7 object-cover border border-sand-gold" />
                  ) : (
                    <div className="w-7 h-7 border border-sand-gold bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-sans font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-mid-gold hidden sm:block" strokeWidth={2} />
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-1 w-52 bg-parchment border border-sand-gold/60 z-20 shadow-lg">
                      <div className="px-4 py-3 border-b border-sand-gold/40">
                        <p className="text-sm font-sans font-medium text-espresso truncate">{user?.name}</p>
                        <p className="text-xs font-sans text-mid-gold truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { to: '/profile', label: 'My Profile' },
                          { to: '/orders',  label: 'My Orders'  },
                          { to: '/wishlist', label: 'Wishlist'  },
                        ].map(({ to, label }) => (
                          <Link
                            key={to}
                            to={to}
                            className="block px-4 py-2.5 text-sm text-espresso hover:bg-sand-gold/20 transition-colors font-sans"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            {label}
                          </Link>
                        ))}
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-100 transition-colors font-sans font-semibold"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2.5 text-sm text-claret hover:bg-claret/10 transition-colors font-sans"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login"    className="btn-secondary btn-sm">Sign In</Link>
                <Link to="/register" className="btn-primary  btn-sm">Join</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-primary-600"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen
                ? <X className="w-5 h-5" strokeWidth={1.5} />
                : <Menu className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category bar — desktop ───────────────────────────────── */}
      <div className="hidden md:block border-t border-sand-gold/40 bg-parchment">
        <div className="container-custom">
          <nav className="flex items-center justify-center gap-8 h-9">
            {CATEGORIES.map(({ label, slug }) => (
              <NavLink
                key={slug}
                to={`/products?category=${slug}`}
                className={({ isActive }) =>
                  `text-xs tracking-[0.18em] uppercase font-sans font-medium transition-colors pb-0.5 ${
                    isActive
                      ? 'text-primary-600 border-b border-primary-600'
                      : 'text-mid-gold hover:text-primary-600'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile search + menu ─────────────────────────────────── */}
      {searchOpen && (
        <div className="md:hidden px-4 py-3 border-t border-sand-gold/40 bg-parchment">
          <SearchBar />
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden border-t border-sand-gold/40 bg-parchment">
          <nav className="container-custom py-3 flex flex-col">
            {CATEGORIES.map(({ label, slug }) => (
              <Link
                key={slug}
                to={`/products?category=${slug}`}
                className="py-3 text-xs tracking-wider uppercase text-mid-gold hover:text-primary-600 transition-colors border-b border-sand-gold/30 last:border-0 font-sans font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <Link to="/orders"   className="py-3 text-xs tracking-wider uppercase text-espresso hover:text-primary-600 transition-colors font-sans font-medium mt-2" onClick={() => setMenuOpen(false)}>My Orders</Link>
                <Link to="/profile"  className="py-3 text-xs tracking-wider uppercase text-espresso hover:text-primary-600 transition-colors font-sans font-medium" onClick={() => setMenuOpen(false)}>Profile</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
