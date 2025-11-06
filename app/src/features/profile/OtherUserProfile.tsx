import { HeartIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';
import { useLikePost } from '../../hooks/likepost/useLikePost.tsx';
import { useUserFind } from '../../hooks/auth/useAuth.tsx';
import {
  limitChar,
  capitilizeFirstCharacter,
  paragraphLimit,
  defaultImage,
  defaultAboutUser,
} from '../../utility/utils.ts';

export default function OtherUserProfile() {
  const { id } = useParams();
  const { visitUser } = useUserFind(id!);
  const { toggleLike } = useLikePost();

  const handleLike = (e: React.MouseEvent<SVGSVGElement>, postSlugs: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(postSlugs);
  };

  const username = visitUser.data?.user?.username;
  const profileImage = visitUser.data?.user?.images?.[0]?.url || defaultImage;
  const about: string = visitUser.data?.user?.about || defaultAboutUser;

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-30">
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <img src={profileImage} alt="" className="rounded-full size-50 object-cover border-1" />
        </div>
        <div className="lg:col-span-7 px-10 flex items-center justify-center lg:justify-start ">
          <div className="flex flex-col">
            <div className=" ">
              <h1 className=" relative font-roboto font-semibold text-6xl text-center md:text-center lg:text-justify mt-10 ">
                {capitilizeFirstCharacter(username)}
              </h1>
            </div>
            <div>
              <p className="text-gray-400 font-roboto pr-2 sm:text-center lg:text-justify lg:ml-1 max-w-lg h-[100px] md:max-w-sm  overflow-hidden break-all ">
                {about}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 mt-5">
        {/*                             */}
        {visitUser.data?.posts?.map((post) => (
          <section key={post.slug} className="mb-4 border-b border-b-gray-300 ">
            <div className="flex gap-3 px-5 py-3 ">
              <div className="flex-shrink-0">
                <img
                  src={post.author?.images?.[0]?.url}
                  alt=""
                  className="size-8 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-bold ">{capitilizeFirstCharacter(post.author?.username)}</h1>
                <h2 className="font-semibold mt-1 break-words">{post?.title}</h2>
                <p className="mt-1 break-words">{limitChar(post?.content, paragraphLimit)}</p>

                <div>
                  {post?.images?.[0]?.url && (
                    <div>
                      <img src={post.images[0].url} alt="" className="w-full rounded-sm" />
                      {/* <img src={post?.images?.[0]?.url} alt="" /> */}
                    </div>
                  )}
                </div>

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
