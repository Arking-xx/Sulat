import { useQueryClient, useMutation, type InfiniteData } from '@tanstack/react-query';
import type { PostsResponse, BlogPost } from '../../types/common';
import { likePost } from '../../api/likepost/likePost';
export const useLikePost = () => {
  const queryClient = useQueryClient();

  const likedPost = useMutation<
    { success: boolean; message: string; post: BlogPost },
    { message: string },
    string, // for slugs
    {
      prevPosts?: InfiniteData<PostsResponse>;
      prevSinglePost?: BlogPost;
      prevUserPosts?: { success: boolean; posts: BlogPost[] };
    }
  >({
    mutationFn: likePost.like,
    onMutate: async (slug) => {
      //cancel any ongoing refetches
      // so that don't overwrite the optimistic updatehttp://localhost:5173/post/local-host
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['posts', slug] });

      // saving old data states
      const prevPosts = queryClient.getQueryData<InfiniteData<PostsResponse>>(['posts']);
      const prevSinglePost = queryClient.getQueryData<BlogPost>(['posts', slug]);

      const prevUserPosts = queryClient.getQueryData<{ success: boolean; posts: BlogPost[] }>([
        'posts',
        'me',
      ]);

      console.log(prevPosts);
      // for useInfinite since the array is nested we structured it this way
      if (prevPosts) {
        queryClient.setQueryData<InfiniteData<PostsResponse>>(['posts'], {
          ...prevPosts,
          pages: prevPosts.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.slug === slug
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likesCount: post.likesCount
                      ? Math.max(0, (post.likesCount || 0) - 1)
                      : (post.likesCount || 0) + 1,
                  }
                : post
            ),
          })),
        });
      }

      //
      //
      //for current log user
      if (prevUserPosts) {
        queryClient.setQueryData<{ success: boolean; posts: BlogPost[] }>(['posts', 'me'], {
          ...prevUserPosts,
          posts: prevUserPosts.posts.map((prev) =>
            prev.slug === slug
              ? {
                  ...prev,
                  isLiked: !prev.isLiked,
                  likesCount: prev.likesCount
                    ? Math.max(0, (prev.likesCount || 0) - 1)
                    : (prev.likesCount || 0) + 1,
                }
              : prev
          ),
        });
      }

      if (prevSinglePost) {
        queryClient.setQueryData<BlogPost>(['posts', slug], {
          ...prevSinglePost,
          isLiked: !prevSinglePost.isLiked,
          likesCount: prevSinglePost.likesCount
            ? Math.max(0, (prevSinglePost.likesCount || 0) - 1)
            : (prevSinglePost.likesCount || 0) + 1,
        });
      }

      //
      //
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
                    likesCount: post.likesCount
                      ? Math.max(0, (post.likesCount || 0) - 1)
                      : (post.likesCount || 0) + 1,
                  }
                : post
            ),
          });
        }
      });

      // return the previus data, this will pass to onError as a context
      // so that we can restore the old data if the API calls fails
      return { prevPosts, prevSinglePost, prevUserPosts };
    },
    // purpose is if something fail on API calls, we can rollback
    // to the optimistic update to restore the original state
    onError: (_err, slug, context) => {
      // checking if previous data exist
      // purpose only rollback if there's data state exist
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
    onSuccess: (data, slug) => {
      const updatedPost = data.post; // extract the server data

      // const prevPosts = queryClient.getQueryData<{
      //   success: boolean;
      //   posts: BlogPost[];
      // }>(['posts']);
      //
      // if (prevPosts?.posts) {
      //   queryClient.setQueryData<{ success: boolean; posts: BlogPost[] }>(['posts'], {
      //     ...prevPosts,
      //     posts: prevPosts.posts.map((post) => (post.slug === slug ? updatedPost : post)),
      //   });
      // }

      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: BlogPost) => (post.slug === slug ? updatedPost : post)),
          })),
        };
      });

      queryClient.setQueryData<BlogPost>(['posts', slug], updatedPost);

      const prevUserPost = queryClient.getQueryData<{ success: boolean; posts: BlogPost[] }>([
        'posts',
        'me',
      ]);
      if (prevUserPost?.posts) {
        queryClient.setQueryData<{ success: boolean; posts: BlogPost[] }>(['posts', 'me'], {
          ...prevUserPost,
          posts: prevUserPost.posts.map((post) => (post.slug === slug ? updatedPost : post)),
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
