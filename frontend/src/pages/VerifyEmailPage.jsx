import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useVerifyEmailQuery } from '../redux/api/authApi';
import Loader from '../components/ui/Loader';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const { isLoading, isSuccess, isError } = useVerifyEmailQuery(token);

  return (
    <>
      <Helmet><title>Verify Email – EMarket</title></Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card p-10 max-w-md w-full text-center">
          {isLoading && <Loader text="Verifying your email..." />}

          {isSuccess && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-500 mb-6">Your account has been verified. You can now login.</p>
              <Link to="/login" className="btn-primary px-8 py-3">Go to Login</Link>
            </>
          )}

          {isError && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-500 mb-6">The link is invalid or has expired. Try registering again.</p>
              <Link to="/register" className="btn-primary px-8 py-3">Register Again</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
