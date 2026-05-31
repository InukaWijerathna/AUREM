import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useForgotPasswordMutation } from '../redux/api/authApi';
import { getErrorMessage } from '../utils/helpers';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      toast.success('OTP sent! Check your email.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password — AUREM</title></Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="font-display font-light text-3xl tracking-[0.32em] text-primary-600">AUREM</Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Forgot password?</h1>
            <p className="text-gray-500 mt-1">Enter your email and we'll send you a reset OTP</p>
          </div>

          <div className="card p-8">
            {isSuccess ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">If that email is registered, you'll receive an OTP shortly.</p>
                <Link to="/reset-password" className="btn-primary w-full py-3 block text-center">Enter OTP</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className={`input ${errors.email ? 'input-error' : ''}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-600 mt-6">
              <Link to="/login" className="text-primary-600 font-medium hover:underline">Back to login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
