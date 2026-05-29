import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useGetProductByIdQuery, useCreateProductMutation, useUpdateProductMutation } from '../../redux/api/productApi';
import { useGetCategoriesQuery } from '../../redux/api/categoryApi';
import { getErrorMessage } from '../../utils/helpers';
import Loader from '../../components/ui/Loader';

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: productData, isLoading: loadingProduct } = useGetProductByIdQuery(id, { skip: !id });
  const { data: catData } = useGetCategoriesQuery();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (productData?.product) {
      const p = productData.product;
      reset({
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        discountPrice: p.discountPrice,
        category: p.category?._id,
        brand: p.brand,
        stock: p.stock,
        isFeatured: p.isFeatured,
        tags: p.tags?.join(', '),
      });
    }
  }, [productData, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    const tags = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

    Object.entries({ ...data, tags: JSON.stringify(tags) }).forEach(([k, v]) => {
      if (k !== 'images' && k !== 'tags') formData.append(k, v);
    });
    formData.append('tags', JSON.stringify(tags));

    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file) => formData.append('images', file));
    }

    try {
      if (isEdit) {
        await updateProduct({ id, formData }).unwrap();
        toast.success('Product updated!');
      } else {
        await createProduct(formData).unwrap();
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isEdit && loadingProduct) return <Loader />;

  const isSubmitting = creating || updating;

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Product' : 'Add Product'} – Admin</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <button onClick={() => navigate(-1)} className="btn-secondary text-sm">Back</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input {...register('name', { required: 'Required' })} className={`input ${errors.name ? 'input-error' : ''}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input {...register('shortDescription')} className="input" placeholder="Brief tagline" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea {...register('description', { required: 'Required' })} rows={6} className={`input resize-none ${errors.description ? 'input-error' : ''}`} />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input {...register('tags')} className="input" placeholder="electronics, wireless, gaming" />
              </div>
            </div>

            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Pricing & Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" step="0.01" min="0" {...register('price', { required: 'Required', min: 0 })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                  <input type="number" step="0.01" min="0" {...register('discountPrice')} className="input" placeholder="0 = no discount" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input type="number" min="0" {...register('stock', { required: 'Required' })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input {...register('brand')} className="input" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card p-5 space-y-4">
              <h2 className="font-semibold text-gray-900">Category</h2>
              <select {...register('category', { required: 'Select a category' })} className={`input ${errors.category ? 'input-error' : ''}`}>
                <option value="">Select category</option>
                {catData?.categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
            </div>

            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Images</h2>
              <input type="file" {...register('images')} multiple accept="image/*" className="text-sm" />
              <p className="text-xs text-gray-400 mt-2">Max 6 images, 5MB each</p>
            </div>

            <div className="card p-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Featured Product</p>
                  <p className="text-xs text-gray-400">Show on homepage</p>
                </div>
              </label>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
              {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
