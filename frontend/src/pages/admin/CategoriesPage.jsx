import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../redux/api/categoryApi';
import { openConfirmDialog } from '../../redux/uiSlice';
import { getErrorMessage } from '../../utils/helpers';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Loader from '../../components/ui/Loader';

export default function AdminCategoriesPage() {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null);
  const { data, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const startEdit = (cat) => {
    setEditing(cat);
    setValue('name', cat.name);
    setValue('description', cat.description);
  };

  const cancelEdit = () => {
    setEditing(null);
    reset();
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    if (data.image?.[0]) formData.append('image', data.image[0]);

    try {
      if (editing) {
        await updateCategory({ id: editing._id, formData }).unwrap();
        toast.success('Category updated!');
      } else {
        await createCategory(formData).unwrap();
        toast.success('Category created!');
      }
      cancelEdit();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = (id, name) => {
    dispatch(openConfirmDialog({
      title: 'Delete Category',
      message: `Delete "${name}"? Products in this category will be affected.`,
      onConfirm: async () => {
        try {
          await deleteCategory(id).unwrap();
          toast.success('Category deleted');
        } catch (err) {
          toast.error(getErrorMessage(err));
        }
      },
    }));
  };

  return (
    <>
      <Helmet><title>Categories – Admin</title></Helmet>
      <ConfirmDialog />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input {...register('name', { required: 'Name is required' })} className={`input ${errors.name ? 'input-error' : ''}`} placeholder="Electronics" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea {...register('description')} rows={3} className="input resize-none" placeholder="Category description" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input type="file" {...register('image')} accept="image/*" className="text-sm" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={creating || updating} className="btn-primary flex-1 text-sm">
                {creating || updating ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              {editing && <button type="button" onClick={cancelEdit} className="btn-secondary text-sm px-4">Cancel</button>}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 card overflow-hidden">
          {isLoading ? (
            <div className="p-8"><Loader /></div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Sub</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.categories?.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {cat.image?.url && (
                          <img src={cat.image.url} alt={cat.name} className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                        )}
                        <div>
                          <p className="font-medium text-sm text-gray-900">{cat.name}</p>
                          {cat.description && <p className="text-xs text-gray-400 truncate max-w-xs">{cat.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{cat.subcategories?.length || 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
