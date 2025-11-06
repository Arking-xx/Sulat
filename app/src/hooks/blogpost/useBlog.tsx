import { useQueryClient, useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { blogApi } from '../../api/blogpost/blogApi';
import type { PostsResponse } from '../../types/common';

export const useBlog = (slug?: string) => {
  const queryClient = useQueryClient();

  const getAllPosts = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => blogApi.getAllPost(pageParam, 10),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      if (!lastPage.pagination) return undefined;
      return lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    retry: false,
    staleTime: 10_000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5000,
  });

  const { data: singlePost } = useQuery({
    queryKey: ['posts', slug],
    queryFn: () => blogApi.getSinglePost(slug!),
    enabled: !!slug,
    staleTime: 10_000,
    gcTime: 10 * 60 * 1000,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
    // refetchInterval: 3000,
    initialData: () => {
      const cachedData = queryClient.getQueryData<PostsResponse>(['posts']);
      // if (!cachedData?.posts) return undefined;

      const post = cachedData?.posts?.find((post) => post.slug === slug);
      return post;
    },
  });

  const currentUserPost = useQuery({
    queryKey: ['posts', 'me'],
    queryFn: blogApi.getCurrentUserLogPost,
  });

  const createBlogMutation = useMutation({
    mutationFn: blogApi.createPost,
    onSuccess: (data) => {
      console.log('Post created', data);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ formdata, slug }: { formdata: FormData; slug: string | undefined }) =>
      blogApi.updatePost(formdata, slug),
    onSuccess: (data) => {
      console.log('update post', data);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: blogApi.deletePost,
    onSuccess: (slug) => {
      queryClient.setQueryData(['posts', slug], slug);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    getAllPosts,
    singlePost,
    currentUserPost,
    createPost: createBlogMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
    updatePost: updatePostMutation.mutateAsync,

    isUpdatingPost: updatePostMutation.isPending,
    isCreating: createBlogMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  };
};
