import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../redux/api/authApi';
import { setCredentials, selectIsLoggedIn } from '../redux/authSlice';
import { getErrorMessage } from '../utils/helpers';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn, navigate, from]);

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result.user));
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <Helmet><title>Login — AUREM</title></Helmet>
      <div className="min-h-screen bg-champagne flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="font-display font-light text-3xl tracking-[0.32em] text-primary-600">AUREM</Link>
            <h1 className="font-display font-light text-2xl text-espresso mt-4">Welcome back</h1>
            <p className="text-mid-gold text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-espresso mb-1">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-espresso">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-mid-gold mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
