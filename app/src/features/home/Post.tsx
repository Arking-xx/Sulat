import { useBlog } from '../../hooks/blogpost/useBlog.tsx';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';
import { useLikePost } from '../../hooks/likepost/useLikePost.tsx';
import { capitilizeFirstCharacter } from '../../utility/utils.ts';

export default function Post() {
  const { slug } = useParams();
  const { singlePost } = useBlog(slug);
  const { toggleLike } = useLikePost();

  const handleLike = (e: React.MouseEvent<SVGSVGElement>, postSlugs: string) => {
    e.stopPropagation();
    e.preventDefault();
    toggleLike(postSlugs);
  };

  return (
    <div className=" flex items-start justify-center  min-h-screen  mt-26 pl-12 sm:px-12">
      <div className="w-3xl">
        <article className=" flex items-start justify-center gap-4 border-b border-gray-200 sm:pt-5 md:pb-3 lg:pt-5 md:pt-5">
          <div className="flex-1 relative break-all">
            <div className="flex items-center absolute -top-7  gap-2 sm:shrink-0">
              <img
                src={singlePost?.author?.images?.[0]?.url}
                alt=""
                className="rounded-full w-10 h-10 object-cover overflow-hidden hover:border-green-500 hover:border"
              />
              <div>
                <h3 className="font-roboto  font-bold text-text-color  text-[13px]">
                  {capitilizeFirstCharacter(singlePost?.author?.username)}
                </h3>
              </div>
            </div>
            <div className="border border-gray-200  p-10 rounded-2xl">
              <div className="">
                <h2 className="font-extrabold font-roboto text-lg lg:text-2xl">
                  {singlePost?.title}
                </h2>
                {singlePost?.images?.[0]?.url && (
                  <div>
                    <img
                      src={singlePost?.images?.[0]?.url}
                      className="w-full sm:h-50 sm:object-cover md:h-100  mt-5  object-over rounded-sm "
                      alt="Descriptive alt text"
                    />
                  </div>
                )}

                <div className="  ">
                  <div className="text-gray-400 mt-2 sm:relative break-all">
                    <h3>{singlePost?.content}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="gap-1 sm:flex lg:flex   ">
              {/* <HeartIcon */}
              {/*   onClick={(e) => handleLike(e, singlePost?.slug!)} */}
              {/*   className={`cursor-pointer size-6 lg:size-7  stroke-1 hover:fill-red-600 hover:text-white    */}
              {/* ${singlePost?.isLiked ? `fill-red-600 ${'text-white'}` : 'fill-white'}`} */}
              {/* /> */}
              <HeartIcon
                onClick={(e) => handleLike(e, singlePost?.slug!)}
                className={` stroke-1 w-7 cursor-pointer text-gray-400 sm:pt-5 hover:fill-red-600 hover:text-white
              ${singlePost?.isLiked ? `fill-red-600 ${'text-white'}` : 'fill-white'}`}
              />
              <div>
                <p className="font-roboto sm:pt-5 font-normal   text-[22px] text-gray-600">
                  {singlePost?.likesCount}
                </p>
              </div>
            </div>
          </div>

          {/* <hr className="text-gray-300  " /> */}
        </article>
      </div>
    </div>
  );
}
