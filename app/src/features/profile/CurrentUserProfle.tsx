import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth.tsx';
import { useBlog } from '../../hooks/blogpost/useBlog.tsx';
import { useHandleLike } from '../../hooks/useUtilityHook.tsx';
import { HeartIcon } from '@heroicons/react/24/outline';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { LoadingOutlined } from '@ant-design/icons';
import {
  capitilizeFirstCharacter,
  limitChar,
  paragraphLimit,
  defaultImage,
  defaultAboutUser,
} from '../../utility/utils.ts';
import Dropdown from '../../layout/Dropdown.tsx';

export default function CurrentUserProfile() {
  const { user } = useAuth();
  const { slug } = useParams();
  const { currentUserPost, deletePost, isDeleting: deleteLoadingState } = useBlog(slug);
  const { handleLike } = useHandleLike();

  const currentLoggedUserId = user?._id;

  const username = user?.username;
  const profileImage = user?.images?.[0]?.url || defaultImage;
  const about: string = user?.about || defaultAboutUser;

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-30">
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <img src={profileImage} alt="" className="rounded-full size-50 object-cover border-1" />
        </div>
        <div className="lg:col-span-7 px-10 flex items-center justify-center lg:justify-start ">
          <div className="flex flex-col">
            <div className=" ">
              <h1 className="font-roboto font-semibold sm:text-center sm:text-4xl sm:tracking-wide  lg:text-6xl text-center lg:text-justify pt-2">
                {capitilizeFirstCharacter(username)}

                <Link to="/profile/updateProfile" className="text-gray-400  absolute mb-1">
                  {/* <EditOutlined className="text-2xl" /> */}
                  <Pencil1Icon className="size-7" />
                </Link>
              </h1>
            </div>
            <div>
              <h3 className="text-gray-400 font-roboto pr-2 sm:text-center lg:text-justify lg:ml-1 max-w-lg h-[100px] md:max-w-sm  overflow-hidden  ">
                {about}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-5 mt-5">
        {/*                             */}
        {currentUserPost?.data?.ownPost?.map((post) => (
          <section key={post.slug} className="mb-4 border-b border-b-gray-300">
            <div className="flex gap-3  px-5 py-3">
              <div className="flex-shrink-0">
                <img
                  src={post.author?.images?.[0]?.url}
                  alt=""
                  className="size-9  rounded-full  object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 ">
                <div className="relative ">
                  <div className="absolute sm:right-[-16px] md:right-[-16px] lg:right-[-36px] -top-10">
                    {post.author?._id === currentLoggedUserId && (
                      <Dropdown onDelete={() => deletePost(post.slug)} slug={post.slug} />
                    )}
                  </div>
                </div>

                {deleteLoadingState ? (
                  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-none bg-black/5  z-50">
                    <LoadingOutlined className="text-6xl animate-spin" />
                  </div>
                ) : null}

                <Link to={`/post/${post.slug}`}>
                  <h1 className="font-bold">{capitilizeFirstCharacter(post.author?.username)}</h1>
                  <h2 className="font-semibold mt-1 break-words">{post?.title}</h2>
                  <p className="mt-1 break-words">{limitChar(post?.content, paragraphLimit)}</p>

                  <div>
                    {post?.images?.[0]?.url && (
                      <div>
                        <img
                          src={post.images[0].url}
                          alt=""
                          className="sm:h-50 md:h-100 w-full rounded-sm object-cover"
                        />
                      </div>
                    )}
                  </div>
                </Link>

                <div className=" flex items-center mt-2 py-1">
                  <div>
                    <HeartIcon
                      onClick={(e) => handleLike(e, post.slug!)}
                      className={`cursor-pointer size-6 lg:size-7  stroke-1 hover:fill-red-600 hover:text-white
    									${post.isLiked ? `fill-red-600 ${'text-white'}` : 'fill-white'}`}
                    />
                  </div>
                  <div className="">
                    {post?.likesCount ? (
                      <p className="ml-1 font-roboto font-light text-[22px] lg:text-[24px]  ">
                        {post.likesCount}
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
