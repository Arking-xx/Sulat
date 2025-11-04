export type Image = {
  url: string;
  filename: string;
  _id?: string;
};

// user
export type User = {
  _id: string;
  username: string;
  about: string;
  email: string;
  images: Image[];
  posts?: BlogPost[];
  password?: string;
};

export type RegisterUserData = Pick<User, 'username' | 'email' | 'password'>;
export type CheckAuth = Pick<User, '_id' | 'username' | 'about' | 'images'>;

export type UpdateUser = {
  _id?: string;
  username: string;
  email?: string;
  about: string;
  images: FileList;
};

//BlogPost
export type Author = {
  _id?: string;
  username: string;
  email?: string;
  about?: string;
  images: Image[];
};

export type BlogPost = {
  _id?: string;
  author: Author;
  title: string;
  content: string;
  slug: string | null;
  likesCount?: number;
  isLiked: boolean;
  images: Image[];
};

export type CreateBlog = Pick<BlogPost, 'title' | 'content'> & {
  slug?: string;
  images?: FileList;
};

export type UpdatePost = Pick<BlogPost, 'title' | 'content'> & {
  slug?: string;
  images?: FileList;
};

export type SearchTitle = Pick<BlogPost, '_id' | 'title' | 'author'> & {
  slug?: string;
  author: Author;
};

export type BlogpostApiResponse<TData> = {
  success?: boolean;
  posts?: TData;
};

// api response
export type BackendResponse<TData = unknown> = {
  success: boolean;
  error?: string;
  message?: string;
} & TData;

//  Blogpost api response
export type CreatePostResponse = BackendResponse<{ post: CreateBlog }>;
export type PostResponse = BackendResponse<{ post: BlogPost }>;
export type PostsResponse = BackendResponse<{
  posts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    postsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}>;
export type UpdatePostResponse = BackendResponse<{ updatedPost: UpdatePost }>;
export type GetCurrentLogPostReponse = BackendResponse<{ posts: BlogPost[] }>;
export type DeletePostResponse = BackendResponse<{ deletedPost: BlogPost }>;
export type SearchTitleResponse = BackendResponse<{ searchTitle: SearchTitle[] }>;

// user api response
export type RegisterUserResponse = BackendResponse<{ user: RegisterUserData }>;
export type LoginPostResponse = BackendResponse<{ user: User }>;
export type CheckAuthRespone = BackendResponse<{ user: User }>;
export type VisitUserResponse = BackendResponse<{ user: User; posts: BlogPost[] }>;
export type UpdateUserResponse = BackendResponse<{ user: CheckAuth }>;
