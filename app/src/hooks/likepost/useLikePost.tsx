import { useQueryClient, useMutation, type InfiniteData } from '@tanstack/react-query';
import type { getAllPostResponse, BlogPost } from '../../types/common';
import { likePost } from '../../api/likepost/likePost';
export const useLikePost = () => {
  const queryClient = useQueryClient();

  const likedPost = useMutation<
    { post: BlogPost },
    Error,
    string, // for slugs
    {
      prevPosts?: InfiniteData<getAllPostResponse>;
      prevSinglePost?: BlogPost;
      prevUserPosts?: { ownPost: BlogPost[] };
    }
  >({
    mutationFn: likePost.like,
    onMutate: async (slug) => {
      //cancel any ongoing refetches
      // so that don't overwrite the optimistic updatehttp://localhost:5173/post/local-host
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['posts', slug] });

      // saving old data states
      const prevPosts = queryClient.getQueryData<InfiniteData<getAllPostResponse>>(['posts']);
      const prevSinglePost = queryClient.getQueryData<BlogPost>(['posts', slug]);
      const prevUserPosts = queryClient.getQueryData<{ ownPost: BlogPost[] }>(['posts', 'me']);

      // for useInfinite since its paginated and the data is nested in array, so we structured it this way
      if (prevPosts) {
        queryClient.setQueryData<InfiniteData<getAllPostResponse>>(['posts'], {
          ...prevPosts,
          pages: prevPosts.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.slug === slug
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likesCount: post.isLiked
                      ? Math.max(0, (post.likesCount || 0) - 1)
                      : (post.likesCount || 0) + 1,
                  }
                : post
            ),
          })),
        });
      }

      //for current log user
      if (prevUserPosts) {
        queryClient.setQueryData<{ ownPost: BlogPost[] }>(['posts', 'me'], {
          ...prevUserPosts,
          ownPost: prevUserPosts.ownPost.map((prev) =>
            prev.slug === slug
              ? {
                  ...prev,
                  isLiked: !prev.isLiked,
                  likesCount: prev.isLiked
                    ? Math.max(0, (prev.likesCount || 0) - 1)
                    : (prev.likesCount || 0) + 1,
                }
              : prev
          ),
        });
      }

      // when visiting actual post
      if (prevSinglePost) {
        queryClient.setQueryData<BlogPost>(['posts', slug], {
          ...prevSinglePost,
          isLiked: !prevSinglePost.isLiked,
          likesCount: prevSinglePost.isLiked
            ? Math.max(0, (prevSinglePost.likesCount || 0) - 1)
            : (prevSinglePost.likesCount || 0) + 1,
        });
      }

      //
      // cache all user
      const userQueries = queryClient.getQueryCache().findAll({ queryKey: ['user'] });
      userQueries.forEach((query) => {
        const userData = query.state.data;
        if (userData?.posts) {
          queryClient.setQueryData(query.queryKey, {
            ...userData,
            posts: userData.posts.map((post) =>
              post.slug === slug
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likesCount: post.isLiked
                      ? Math.max(0, (post.likesCount || 0) - 1)
                      : (post.likesCount || 0) + 1,
                  }
                : post
            ),
          });
        }
      });

      // return the previus data, this will pass to onError as a snapshot value
      // so that we can restore the old data if the API calls fails
      return { prevPosts, prevSinglePost, prevUserPosts };
    },
    // purpose is if something fail on API calls, we can rollback
    // to the optimistic update to restore the original state
    onError: (_err, slug, context) => {
      // checking if previous data exist
      // purpose only rollback if server side mutation fails
      if (context?.prevPosts) {
        queryClient.setQueryData(['posts'], context.prevPosts);
      }
      if (context?.prevSinglePost) {
        queryClient.setQueryData(['posts', slug], context.prevSinglePost);
      }
      if (context?.prevUserPosts) {
        queryClient.setQueryData(['posts', 'me'], context.prevUserPosts);
      }

      //if error back to original data coming from database
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },

    // runs after the API calls succeed
    // purpose is to replace the optimistic data with real server data
    onSettled: (data, slug) => {
      const updatedPost = data!.post; // extract the server data

      queryClient.setQueryData<InfiniteData<getAllPostResponse>>(['posts'], (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) => (post.slug === slug ? updatedPost : post)),
          })),
        };
      });

      queryClient.setQueryData<BlogPost>(['posts', slug], updatedPost);

      const prevUserPost = queryClient.getQueryData<{ ownPost: BlogPost[] }>(['posts', 'me']);
      if (prevUserPost?.ownPost) {
        queryClient.setQueryData<{ ownPost: BlogPost[] }>(['posts', 'me'], {
          ...prevUserPost,
          ownPost: prevUserPost.ownPost.map((post) => (post.slug === slug ? updatedPost : post)),
        });
      }

      const userQueries = queryClient.getQueryCache().findAll({ queryKey: ['user'] });
      userQueries.forEach((query) => {
        const userData = query.state.data;
        if (userData?.posts) {
          queryClient.setQueryData(query.queryKey, {
            ...userData,
            posts: userData.posts.map((post) => (post.slug === slug ? updatedPost : post)),
          });
        }
      });
    },
  });

  return {
    toggleLike: likedPost.mutate,
    ...likedPost,
  };
};
