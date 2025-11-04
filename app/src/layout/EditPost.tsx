import { ImageIcon, Cross1Icon } from '@radix-ui/react-icons';
import { useBlog } from '../features/home/blog/useBlog';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Navbar from '../features/home/Navbar';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSchema } from '../validation/formSchema';
import { useImagePreview } from '../features/ui/useComponent';
import { useAuth } from '../features/auth/useAuth';
import { LoadingOutlined } from '@ant-design/icons';
import type { UpdatePost } from '../types/common';
import { useEffect } from 'react';

export default function EditPost() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { updatePost, isUpdatingPost, singlePost } = useBlog(slug);
  const { updateUserLoading } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePost>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: singlePost?.title || '',
      content: singlePost?.content || '',
    },
  });

  const { imagePreview, handleChange, handleRemove } = useImagePreview({
    initialImage: singlePost?.images?.[0]?.url,
  });

  useEffect(() => {
    if (singlePost) {
      reset({
        title: singlePost.title,
        content: singlePost.content,
      });
    }
  }, [singlePost, reset]);

  const onSubmit: SubmitHandler<UpdatePost> = async (data) => {
    try {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      if (data.images && data.images[0]) {
        formData.append('image', data.images[0]);
      }
      const response = await updatePost({ formdata: formData, slug });
      console.log(response);
      navigate(`/post/${response.updatedPost.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-25 flex justify-center mx-auto  ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex ">
          <div className="flex flex-col gap-2  px-5 sm:w-80 md:min-w-lg ">
            <div>
              {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
            </div>
            <textarea
              className="resize-none text-2xl font-lora focus:outline-none overflow-hidden "
              placeholder="Title"
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              {...register('title')}
            />
            <div>
              {errors.content && (
                <span className="text-xs text-red-500">{errors.content.message}</span>
              )}
            </div>
            <textarea
              className="resize-none focus:outline-none sm:text-xl mt-2 overflow-hidden"
              placeholder="Tell your story..."
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              {...register('content')}
            />
            <div className="relative">
              {imagePreview && (
                <div>
                  <button
                    onClick={handleRemove}
                    className=" absolute  right-0  stroke-amber-50 z-50 "
                  >
                    <Cross1Icon className="size-7" />
                  </button>
                  <img
                    src={imagePreview}
                    alt=""
                    className="rounded-sm  size-50 w-full object-cover md:size-80 md:w-full "
                  />
                </div>
              )}
            </div>
            <div className="pt-5 relative mobile-only md:hidden">
              <label htmlFor="upload_image">
                <ImageIcon className="absolute  left-0 z-10 size-8" />
              </label>
              {
                <button className="bg-black text-white  rounded-full px-2 absolute right-0 mt-2">
                  Publish
                </button>
              }
            </div>
          </div>
          <div className="mt-2 sm:hidden md:block  ">
            <label htmlFor="upload_image">
              <ImageIcon className="size-8" />
            </label>
            <input
              type="file"
              hidden
              id="upload_image"
              accept="image/*"
              {...register('images', { onChange: handleChange })}
            />
          </div>
        </div>
        <Navbar
          button={
            <button
              type="submit"
              className="border rounded-2xl text-white bg-black w-23 h-8 mr-3 font-semibold cursor-pointer"
            >
              {isUpdatingPost ? <LoadingOutlined className="mb-1" /> : 'Publish'}
            </button>
          }
        />
      </form>
    </div>
  );
}
