import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useGetProductsQuery, useDeleteProductMutation } from '../../redux/api/productApi';
import { openConfirmDialog } from '../../redux/uiSlice';
import { formatCurrency } from '../../utils/helpers';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetProductsQuery({ page, limit: 15, keyword: search });
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = (id, name) => {
    dispatch(openConfirmDialog({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${name}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteProduct(id).unwrap();
          toast.success('Product deleted');
        } catch {
          toast.error('Failed to delete product');
        }
      },
    }));
  };

  return (
    <>
      <Helmet><title>Products – Admin</title></Helmet>
      <ConfirmDialog />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new" className="btn-primary px-4 py-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="input max-w-sm text-sm"
          />
        </div>

        {isLoading ? (
          <div className="p-8"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.products?.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]?.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{p.category?.name}</td>
                    <td className="px-5 py-3 text-sm font-medium">{formatCurrency(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/products/${p._id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {data && <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />}
    </>
  );
}
