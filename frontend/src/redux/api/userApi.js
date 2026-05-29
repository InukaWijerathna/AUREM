import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateMe: builder.mutation({
      query: (data) => ({ url: '/users/me', method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    updateAvatar: builder.mutation({
      query: (formData) => ({ url: '/users/me/avatar', method: 'PUT', body: formData }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: '/users/change-password', method: 'PUT', body: data }),
    }),
    addAddress: builder.mutation({
      query: (data) => ({ url: '/users/me/addresses', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    updateAddress: builder.mutation({
      query: ({ addressId, ...data }) => ({
        url: `/users/me/addresses/${addressId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({ url: `/users/me/addresses/${addressId}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    // Admin
    getAllUsers: builder.query({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({ url: `/users/${id}`, method: 'PUT', body: { role } }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateAvatarMutation,
  useChangePasswordMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userApi;
