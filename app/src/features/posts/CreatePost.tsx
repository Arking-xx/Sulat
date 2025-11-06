import { ImageIcon, Cross1Icon } from '@radix-ui/react-icons';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBlog } from '../../hooks/blogpost/useBlog.tsx';
import { useImagePreview } from '../../hooks/useImagePreview.tsx';
import type { CreateBlog } from '../../types/common.ts';
import { resizeTextArea } from '../../utility/utils.ts';
import { writeSchema } from '../../validation/formSchema.ts';
import Navbar from '../home/Navbar.tsx';

export default function CreatePost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBlog>({
    resolver: zodResolver(writeSchema),
    mode: 'onBlur',
  });

  const { slug } = useParams();
  const { createPost, isCreating } = useBlog(slug);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CreateBlog> = async (data) => {
    try {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      if (data.images && data.images[0]) {
        formData.append('image', data.images[0]);
      }
      const response = await createPost(formData);
      console.log(response);
      navigate(`/post/${response.post.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  const { imagePreview, handleChange, handleRemove } = useImagePreview();

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
              onInput={(e) => resizeTextArea(e)}
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
              onInput={(e) => resizeTextArea(e)}
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
              {isCreating ? <LoadingOutlined className="mb-1" /> : 'Publish'}
            </button>
          }
        />
      </form>
    </div>
  );
}
