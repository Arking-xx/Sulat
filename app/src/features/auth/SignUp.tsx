import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type userRegister } from '../../validation/formSchema';
import { useAuth } from '../../hooks/auth/useAuth';

export default function SignUp() {
  const { registerUser } = useAuth();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userRegister>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<userRegister> = async (user) => {
    try {
      const createUser = await registerUser(user);
      console.log('User created', createUser);
      navigate('/posts');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  p-4 bg-primary">
      <form
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">Create Account</h2>

        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            {errors.username && (
              <span className="text-xs text-red-500">{errors.username.message}</span>
            )}
          </div>
          <input
            id="username"
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your username"
            {...register('username')}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <input
            id="email"
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password.message}</span>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?&nbsp;
          <a
            href="/signin"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
