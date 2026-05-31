import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '../redux/api/authApi';
import { getErrorMessage } from '../utils/helpers';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await resetPassword({ otp: data.otp, password: data.password }).unwrap();
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <Helmet><title>Reset Password — AUREM</title></Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="font-display font-light text-3xl tracking-[0.32em] text-primary-600">AUREM</Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Reset your password</h1>
            <p className="text-gray-500 mt-1">Enter the OTP from your email and choose a new password</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                <input
                  type="text"
                  {...register('otp', { required: 'OTP is required', minLength: { value: 6, message: 'Enter the 6-digit OTP' } })}
                  className={`input text-center text-2xl tracking-widest ${errors.otp ? 'input-error' : ''}`}
                  placeholder="------"
                  maxLength={6}
                />
                {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === password || 'Passwords do not match',
                  })}
                  className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              <Link to="/forgot-password" className="text-primary-600 hover:underline">Resend OTP</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
