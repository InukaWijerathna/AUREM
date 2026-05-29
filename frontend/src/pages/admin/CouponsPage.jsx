import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from '../../redux/api/couponApi';
import { openConfirmDialog } from '../../redux/uiSlice';
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/helpers';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Loader from '../../components/ui/Loader';

export default function AdminCouponsPage() {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null);
  const { data, isLoading } = useGetCouponsQuery();
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({ defaultValues: { discountType: 'percentage' } });
  const discountType = watch('discountType');

  const startEdit = (coupon) => {
    setEditing(coupon);
    setValue('code', coupon.code);
    setValue('discountType', coupon.discountType);
    setValue('discountValue', coupon.discountValue);
    setValue('minOrderAmount', coupon.minOrderAmount);
    setValue('maxDiscountAmount', coupon.maxDiscountAmount);
    setValue('usageLimit', coupon.usageLimit);
    setValue('expiresAt', coupon.expiresAt?.split('T')[0]);
    setValue('isActive', coupon.isActive);
  };

  const cancelEdit = () => { setEditing(null); reset(); };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateCoupon({ id: editing._id, ...data }).unwrap();
        toast.success('Coupon updated!');
      } else {
        await createCoupon(data).unwrap();
        toast.success('Coupon created!');
      }
      cancelEdit();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = (id, code) => {
    dispatch(openConfirmDialog({
      title: 'Delete Coupon',
      message: `Delete coupon "${code}"?`,
      onConfirm: async () => {
        try {
          await deleteCoupon(id).unwrap();
          toast.success('Coupon deleted');
        } catch {
          toast.error('Failed to delete coupon');
        }
      },
    }));
  };

  return (
    <>
      <Helmet><title>Coupons – Admin</title></Helmet>
      <ConfirmDialog />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Coupons</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{editing ? 'Edit Coupon' : 'Create Coupon'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Code *</label>
              <input {...register('code', { required: 'Required' })} className="input text-sm uppercase" placeholder="SAVE10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select {...register('discountType')} className="input text-sm">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Value *</label>
                <input type="number" min="0" step="0.01" {...register('discountValue', { required: 'Required' })} className="input text-sm" placeholder={discountType === 'percentage' ? '10' : '20'} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Order ($)</label>
              <input type="number" min="0" {...register('minOrderAmount')} className="input text-sm" defaultValue="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Discount ($) <span className="text-gray-400">(0 = no cap)</span></label>
              <input type="number" min="0" {...register('maxDiscountAmount')} className="input text-sm" defaultValue="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Usage Limit <span className="text-gray-400">(0 = unlimited)</span></label>
              <input type="number" min="0" {...register('usageLimit')} className="input text-sm" defaultValue="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Expires At *</label>
              <input type="date" {...register('expiresAt', { required: 'Required' })} className="input text-sm" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isActive')} defaultChecked className="rounded" />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={creating || updating} className="btn-primary flex-1 text-sm">
                {creating || updating ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              {editing && <button type="button" onClick={cancelEdit} className="btn-secondary text-sm px-3">Cancel</button>}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 card overflow-hidden">
          {isLoading ? (
            <div className="p-8"><Loader /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Discount</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Usage</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Expires</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.coupons?.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono font-medium text-sm">{coupon.code}</td>
                      <td className="px-5 py-3 text-sm">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {coupon.usageCount} / {coupon.usageLimit || '∞'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{formatDate(coupon.expiresAt)}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${coupon.isActive && new Date(coupon.expiresAt) > new Date() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {coupon.isActive && new Date(coupon.expiresAt) > new Date() ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(coupon)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => handleDelete(coupon._id, coupon.code)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
