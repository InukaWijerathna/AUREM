import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '../../redux/api/userApi';
import { openConfirmDialog } from '../../redux/uiSlice';
import { formatDate } from '../../utils/helpers';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllUsersQuery({ page, limit: 20 });
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRoleChange = async (id, role) => {
    try {
      await updateRole({ id, role }).unwrap();
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = (id, name) => {
    dispatch(openConfirmDialog({
      title: 'Delete User',
      message: `Delete user "${name}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteUser(id).unwrap();
          toast.success('User deleted');
        } catch {
          toast.error('Failed to delete user');
        }
      },
    }));
  };

  return (
    <>
      <Helmet><title>Users – Admin</title></Helmet>
      <ConfirmDialog />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {data && <p className="text-sm text-gray-500">{data.total} total users</p>}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Verified</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.users?.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleDelete(user._id, user.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
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
