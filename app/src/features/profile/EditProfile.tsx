import Navbar from '../../layout/Navbar';
import { CameraIcon } from '@heroicons/react/24/outline';
import { LoadingOutlined } from '@ant-design/icons';
import Button from '../components/ui/Button';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useImagePreview } from '../../hooks/useImagePreview';
import { useAuth } from '../../hooks/auth/useAuth';
import { useTextarea } from '../../hooks/useUtilityHook';
import { capitilizeFirstCharacter, resizeTextArea } from '../../utility/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserInfoSchema } from '../../validation/formSchema';
import { type UpdateUserResponse } from '../../types/common';
import { defaultImage } from '../../utility/utils';

export default function EditProfile() {
  const { user, updateUser, updateUserLoading } = useAuth();
  const navigate = useNavigate();

  const profile = user?.images?.[0]?.url || defaultImage;

  const { imagePreview, handleChange } = useImagePreview({
    initialImage: profile,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdateUserResponse>({
    resolver: zodResolver(updateUserInfoSchema),
    mode: 'onBlur',
    defaultValues: {
      username: user?.username || ' ',
      about: user?.about || '',
    },
  });

  const contentValue = watch('about');
  useTextarea('about', contentValue);

  const onSubmit: SubmitHandler<UpdateUserResponse> = async (data) => {
    try {
      const formData = new FormData();
      if (data.username) formData.append('username', data.username);
      if (data.about) formData.append('about', data.about);
      if (data.images && data.images[0]) {
        console.log('selected file', data.images[0]);
        formData.append('image', data.images[0]);
      } else {
        console.log('no file selected');
      }
      await updateUser(formData);
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-30">
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <img
              src={imagePreview}
              alt=""
              className="rounded-full w-50 h-50 object-cover border-1"
            />
            <div className="relative sm:hidden md:block lg:block">
              <div className="absolute right-3 top-36 ">
                <label htmlFor="upload_image">
                  <CameraIcon className="w-8 h-8 fill-white hover:text-gray-600" />
                </label>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 px-10 flex items-center justify-center lg:justify-start ">
            <div className="flex flex-col">
              <h1 className="font-roboto font-semibold text-6xl">
                {capitilizeFirstCharacter(user?.username)}
              </h1>
              <div className="mobile-only md:hidden lg:hidden">
                <label htmlFor="upload_image">
                  <p className="text-green-500 font-roboto sm:text-center lg:text-justify lg:ml-1">
                    Upload image
                  </p>
                </label>
              </div>
            </div>

            <input
              type="file"
              id="upload_image"
              accept="image/*"
              hidden
              {...register('images', { onChange: handleChange })}
            />
          </div>

          <div className="sm:pt-5 md:min-w-100 lg:col-end-6 lg:min-w-100 text-gray-500">
            <div className="flex flex-col">
              {errors.username && (
                <span className="text-xs text-red-500">{errors.username.message}</span>
              )}
              <input
                type="text"
                id="username"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition-all"
                placeholder="Username"
                {...register('username')}
              />
              <textarea
                className="resize-none focus:outline-none sm:text-xl mt-5 overflow-hidden"
                placeholder="Tell about yourself..."
                {...register('about')}
                onInput={(e) => resizeTextArea(e)}
              />
            </div>
          </div>
        </div>
        <Navbar
          className={
            'bg-primary z-50  flex items-center justify-between py-4 pb-5  fixed top-0 left-0 w-full sm:px-3 md:px-20 lg:px-20'
          }
          button={
            <Button
              type="submit"
              className="border rounded-2xl text-white bg-black w-23 h-8 mr-3 font-semibold cursor-pointer"
            >
              {updateUserLoading ? <LoadingOutlined className="mb-1" /> : 'Submit'}
            </Button>
          }
        />
      </form>
    </div>
  );
}
