import Navbar from '../home/Navbar';
import { CameraIcon } from '@heroicons/react/24/outline';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useImagePreview } from '../../hooks/useImagePreview';
import { useAuth } from '../../hooks/auth/useAuth';
import { useTextarea } from '../../hooks/useUtilityHook';
import { capitilizeFirstCharacter, resizeTextArea } from '../../utility/utils';

export type UpdateUser = {
  username?: string;
  about?: string;
  image?: FileList;
};

export default function EditProfile() {
  // default and fallback if user didn't upload or update their user info
  const { user, updateUser, updateUserLoading } = useAuth();
  const navigate = useNavigate();

  const profile =
    user?.images?.[0]?.url ||
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  const { imagePreview, handleChange } = useImagePreview({
    initialImage: profile,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdateUser>({
    mode: 'onBlur',
    defaultValues: {
      username: user?.username || ' ',
      about: user?.about || '',
    },
  });

  const contentValue = watch('about');
  useTextarea('about', contentValue);

  const onSubmit: SubmitHandler<UpdateUser> = async (data) => {
    try {
      const formData = new FormData();
      if (data.username) formData.append('username', data.username);
      if (data.about) formData.append('about', data.about);
      if (data.image && data.image[0]) {
        console.log('selected file', data.image[0]);
        formData.append('image', data.image[0]);
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
              {...register('image', { onChange: handleChange })}
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
          button={
            <button
              type="submit"
              className="border rounded-2xl text-white bg-black w-23 h-8 mr-3 font-semibold cursor-pointer"
            >
              {updateUserLoading ? <LoadingOutlined className="mb-1" /> : 'Submit'}
            </button>
          }
        />
      </form>
    </div>
  );
}
