import {
  useQueryClient,
  useQuery,
  useMutation,
  useInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import { blogApi } from '../../api/blogpost/blogApi';
import type { getAllPostResponse } from '../../types/common';

export const useBlog = (slug?: string) => {
  const queryClient = useQueryClient();

  // must use when back-end return paginated data
  const getAllPosts = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = 1 }) => blogApi.getAllPost(pageParam, 10),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    retry: false,
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: singlePost } = useQuery({
    queryKey: ['posts', slug],
    queryFn: () => blogApi.getSinglePost(slug!),
    enabled: !!slug,
    staleTime: 60_000,
    gcTime: 10 * 60 * 100,
    initialData: () => {
      //find in every pages
      const cachedData = queryClient.getQueryData<InfiniteData<getAllPostResponse>>(['posts']);
      if (!cachedData?.pages) return undefined;

      for (const page of cachedData.pages) {
        const post = page?.posts?.find((post) => post.slug === slug);
        if (post) return post;
      }
      return undefined;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const currentUserPost = useQuery({
    queryKey: ['posts', 'me'],
    queryFn: blogApi.getCurrentUserLogPost,
  });

  const createBlogMutation = useMutation({
    mutationFn: blogApi.createPost,
    onSuccess: (data) => {
      queryClient.setQueryData(['posts'], data);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ formdata, slug }: { formdata: FormData; slug: string | undefined }) =>
      blogApi.updatePost(formdata, slug),
    onSuccess: (slug) => {
      queryClient.setQueryData(['posts', slug], slug);
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
