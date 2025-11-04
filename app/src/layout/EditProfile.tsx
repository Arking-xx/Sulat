import { CameraIcon } from '@heroicons/react/24/outline';
import { LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../features/auth/useAuth';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useImagePreview } from '../features/ui/useComponent';
import { capitilizeFirstCharacter } from '../utility/utils';
import Navbar from '../features/home/Navbar';
import { useNavigate } from 'react-router-dom';

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

  const { imagePreview, handleChange, handleRemove, resetToInitial } = useImagePreview({
    initialImage: profile,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUser>({
    mode: 'onBlur',
    defaultValues: {
      username: user?.username || ' ',
      about: user?.about || '',
    },
  });

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
                rows={10}
                className="resize-none focus:outline-none sm:text-xl mt-5 overflow-hidden"
                placeholder="Tell about yourself..."
                {...register('about')}
                onInput={(e) => {
                  e.currentTarget.style.height = 'auto';
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
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
              Submit
            </button>
          }
        />
      </form>
    </div>

    //mistake
    // only one input recognize by useform
    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <div className="lg:mx-50 md:mx-20 xl:mx-100 sm:mx-5 mt-25 z-40">
    //     <div className="max-w-3xl">
    //       <div className="flex items-start">
    //         {/* Desktop version */}
    //         <div className="relative sm:hidden lg:block md:block">
    //           <img
    //             src={imagePreview}
    //             alt="Profile"
    //             className="rounded-full size-50 object-cover border-1"
    //           />
    //           <div className="absolute right-3 top-36">
    //             <label htmlFor="upload_image">
    //               <CameraIcon className="w-8 h-8 fill-white hover:text-gray-600" />
    //             </label>
    //           </div>
    //         </div>
    //
    //         <div className="flex flex-col">
    //           <div className=" flex justify-center">
    //             <img
    //               src={imagePreview}
    //               alt="Profile"
    //               className="rounded-full w-50 h-50 object-cover border"
    //             />
    //           </div>
    //           <div className="text-center">
    //             <label htmlFor="upload_image">Upload Profile</label>
    //           </div>
    //           <input
    //             type="file"
    //             id="upload_image"
    //             accept="image/*"
    //             hidden
    //             {...register('image', { onChange: handleChange })}
    //           />
    //
    //           <div className=" ">
    //             <div className="flex justify-center">
    //               <h1 className="font-roboto font-semibold text-6xl text-text-color mt-10 ">
    //                 {user?.username}
    //               </h1>
    //             </div>
    //
    //             <div>
    //               <p className="font-roboto text-gray-400">
    //                 Recommended: JPG, JPEG, JPEG, maximum image <br />
    //                 support up to 5mb.
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //
    //       <div className="pt-10">
    //         <div className="mt-3">
    //           <label htmlFor="username">Username</label>
    //           {errors.username && (
    //             <span className="text-xs text-red-500">{errors.username.message}</span>
    //           )}
    //           <input
    //             type="text"
    //             id="username"
    //             className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //             placeholder="Username"
    //             {...register('username')}
    //           />
    //         </div>
    //
    //         <div className="mt-3">
    //           <label htmlFor="about">About</label>
    //           {errors.about && <span className="text-xs text-red-500">{errors.about.message}</span>}
    //           <textarea
    //             id="about"
    //             rows={7}
    //             {...register('about')}
    //             className="resize-none block p-2.5 w-full text-gray-900 rounded-lg border border-gray-300 overflow-hidden placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    //             placeholder="Write about yourself"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //     <button
    //       type="submit"
    //       className="bg-blue-600 mt-3 rounded-sm p-1 w-24 text-white cursor-pointer hover:bg-blue-700"
    //     >
    //       {updateUserLoading ? <LoadingOutlined /> : 'Update'}
    //     </button>
    //   </div>
    // </form>
  );
}
