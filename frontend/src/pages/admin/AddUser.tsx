import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createUserSchema, CreateUserForm } from '../../utils/validators';
import api from '../../api/axios';

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'normal_user' },
  });

  const onSubmit = async (data: CreateUserForm) => {
    try {
      await api.post('/admin/users', data);
      toast.success('User created!');
      navigate('/admin/users');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create user');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link to="/admin/users" className="text-indigo-600 text-sm hover:underline mb-4 block">← Back to Users</Link>
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New User</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(['name', 'email', 'address'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field} {field === 'address' ? '(optional)' : ''}</label>
              <input {...register(field)} placeholder={field} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]?.message}</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input {...register('password')} type="password" placeholder="Min 8 chars, 1 uppercase, 1 special" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select {...register('role')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none">
              <option value="normal_user">Normal User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-60">
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
