import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createStoreSchema, CreateStoreForm } from '../../utils/validators';
import api from '../../api/axios';

const AddStore: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateStoreForm>({
    resolver: zodResolver(createStoreSchema),
  });

  const onSubmit = async (data: CreateStoreForm) => {
    try {
      await api.post('/admin/stores', data);
      toast.success('Store and owner account created!');
      navigate('/admin/stores');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create store');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link to="/admin/stores" className="text-indigo-600 text-sm hover:underline mb-4 block">← Back to Stores</Link>
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Store</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-xs text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2">
            Creating a store will also create a Store Owner account linked to it.
          </p>

          <h3 className="font-semibold text-gray-700 text-sm mt-2">Store Details</h3>
          {(['name', 'email', 'address'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{`Store ${field}`} {field === 'address' ? '(optional)' : ''}</label>
              <input {...register(field)} placeholder={field} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]?.message}</p>}
            </div>
          ))}

          <h3 className="font-semibold text-gray-700 text-sm mt-4 pt-4 border-t">Store Owner Account</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
            <input {...register('ownerName')} placeholder="Owner full name" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
            {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
            <input {...register('ownerEmail')} type="email" placeholder="owner@email.com" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
            {errors.ownerEmail && <p className="text-red-500 text-xs mt-1">{errors.ownerEmail.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Password</label>
            <input {...register('ownerPassword')} type="password" placeholder="Min 8 chars, 1 uppercase, 1 special" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
            {errors.ownerPassword && <p className="text-red-500 text-xs mt-1">{errors.ownerPassword.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-60">
            {isSubmitting ? 'Creating...' : 'Create Store & Owner'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
