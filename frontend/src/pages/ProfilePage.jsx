import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useGetMeQuery, useUpdateMeMutation, useChangePasswordMutation, useUpdateAvatarMutation } from '../redux/api/userApi';
import { updateUser } from '../redux/authSlice';
import { getErrorMessage } from '../utils/helpers';
import Loader from '../components/ui/Loader';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const TABS = ['profile', 'security'];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const { data, isLoading } = useGetMeQuery();
  const [updateMe, { isLoading: updating }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changingPw }] = useChangePasswordMutation();
  const [updateAvatar] = useUpdateAvatarMutation();

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: pe } } = useForm();
  const { register: regPw, handleSubmit: handlePw, reset: resetPw, watch, formState: { errors: pwe } } = useForm();
  const newPassword = watch('newPassword');

  const user = data?.user;

  const onProfileSubmit = async (data) => {
    try {
      const res = await updateMe(data).unwrap();
      dispatch(updateUser(res.user));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }).unwrap();
      toast.success('Password changed!');
      resetPw();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await updateAvatar(formData).unwrap();
      dispatch(updateUser({ avatar: res.avatar }));
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) return <div className="container-custom py-12"><Loader /></div>;

  return (
    <>
      <Helmet><title>My Profile — AUREM</title></Helmet>
      <div className="container-custom py-8 max-w-3xl">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'My Profile' }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Avatar */}
        <div className="card p-6 flex items-center gap-6 mb-6">
          <div className="relative">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className={`badge mt-1 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Personal Information</h2>
            <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  {...regProfile('name', { required: 'Name is required' })}
                  defaultValue={user?.name}
                  className={`input ${pe.name ? 'input-error' : ''}`}
                />
                {pe.name && <p className="text-red-500 text-xs mt-1">{pe.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input value={user?.email} disabled className="input bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...regProfile('phone')} defaultValue={user?.phone} className="input" placeholder="+1 (555) 000-0000" />
              </div>
              <button type="submit" disabled={updating} className="btn-primary px-6 py-2">
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Change Password</h2>
            <form onSubmit={handlePw(onPasswordSubmit)} className="space-y-4 max-w-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" {...regPw('currentPassword', { required: 'Required' })} className={`input ${pwe.currentPassword ? 'input-error' : ''}`} placeholder="••••••••" />
                {pwe.currentPassword && <p className="text-red-500 text-xs mt-1">{pwe.currentPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" {...regPw('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} className={`input ${pwe.newPassword ? 'input-error' : ''}`} placeholder="••••••••" />
                {pwe.newPassword && <p className="text-red-500 text-xs mt-1">{pwe.newPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" {...regPw('confirmPassword', { required: 'Required', validate: (v) => v === newPassword || 'Passwords do not match' })} className={`input ${pwe.confirmPassword ? 'input-error' : ''}`} placeholder="••••••••" />
                {pwe.confirmPassword && <p className="text-red-500 text-xs mt-1">{pwe.confirmPassword.message}</p>}
              </div>
              <button type="submit" disabled={changingPw} className="btn-primary px-6 py-2">
                {changingPw ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
