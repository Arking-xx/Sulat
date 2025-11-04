import { HeartIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import { useBlog } from './blog/useBlog.tsx';
import { useLikePost } from './blog/useLikePost.tsx';
import { capitilizeFirstCharacter, paragraphLimit, limitChar } from '../../utility/utils.ts';
import type React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Dropdown from '../../layout/Dropdown.tsx';
import { useAuth } from '../auth/useAuth.tsx';
import { useVisitUser } from '../ui/useComponent.tsx';
import { useEffect, useState, useRef, useMemo } from 'react';

export default function UserLandingPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toggleLike } = useLikePost();
  const { visitUser } = useVisitUser();
  const { getAllPosts, deletePost, isDeleting: deleteLoadingState } = useBlog(slug);
  const [showSpinner, setShowspinner] = useState(false);
  const observerRef = useRef(null);

  const posts = useMemo(
    () => getAllPosts.data?.pages.flatMap((page) => page.posts) || [],
    [getAllPosts.data?.pages]
  );

  const currentLoggedUserId = user?._id;

  const handleLike = (e: React.MouseEvent<SVGSVGElement>, postSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(postSlug);
  };

  useEffect(() => {
    if (!getAllPosts.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !getAllPosts.isFetchingNextPage) {
          getAllPosts.fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [getAllPosts.hasNextPage, getAllPosts.fetchNextPage]);

  useEffect(() => {
    if (getAllPosts.isFetchingNextPage) {
      setShowspinner(true);
    } else if (!getAllPosts.isFetchingNextPage && setShowspinner) {
      const timer = setTimeout(() => setShowspinner(false), 700);
      return () => clearTimeout(timer);
    }
  }, [getAllPosts.isFetchingNextPage]);

  return (
    <div className=" mt-24 max-w-3xl mx-auto px-3 ">
      {getAllPosts.isLoading && <div>Loading posts...</div>}
      {getAllPosts.isError && <div>Error loading posts</div>}

      {posts.map((post) => (
        <div key={post.slug} className="flex gap-3 py-5 border-b border-b-gray-300  ">
          <div className="flex-shrink-0" onClick={() => visitUser(post.author?._id)}>
            <img
              src={post.author?.images?.[0]?.url}
              className="size-8 rounded-full hover:border border-gray-400 cursor-pointer object-cover"
              alt=""
            />
          </div>
          <div className="flex flex-col mt-1 w-full">
            <div className="relative">
              <div className="absolute right-1 -top-10">
                {post.author._id === currentLoggedUserId && (
                  <Dropdown onDelete={() => deletePost(post.slug)} slug={post.slug} />
                )}
              </div>
            </div>

            {deleteLoadingState ? (
              <div className="fixed inset-0 flex items-center justify-center backdrop-blur-none bg-black/5  z-50">
                <LoadingOutlined className="text-6xl animate-spin" />
              </div>
            ) : null}

            <div>
              <h2
                onClick={() => visitUser(post.author?._id)}
                className="hover:underline decoration-[0.5px] cursor-pointer font-roboto font-semibold  w-15"
              >
                {capitilizeFirstCharacter(post.author?.username)}
              </h2>
            </div>
            <Link to={`/post/${post.slug}`} className="cursor-pointer">
              <section className="">
                <h3 className="md:text-xl font-roboto font-bold pt-2">{post?.title}</h3>
                <h3>{post?.content}</h3>
                <div className="pr-8">
                  {post.images?.[0]?.url && (
                    <img
                      src={post.images?.[0]?.url}
                      className="rounded-sm sm:h-50 md:h-100 w-full object-cover "
                      alt=""
                    />
                  )}
                </div>
              </section>
            </Link>
            <div className=" flex items-center mt-2 py-1">
              <div>
                <HeartIcon
                  onClick={(e) => handleLike(e, post.slug!)}
                  className={`cursor-pointer size-6 lg:size-7  stroke-1 hover:fill-red-600 hover:text-white
													${post.isLiked ? `fill-red-600 ${'text-white'}` : 'fill-white'}`}
                />
              </div>
              <div>
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
      ))}

      {getAllPosts.hasNextPage && (
        <div className="flex justify-center py-8" ref={observerRef}>
          {showSpinner && <LoadingOutlined />}
        </div>
      )}
    </div>
  );
}
