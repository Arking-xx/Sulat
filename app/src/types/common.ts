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

export type SinglePost = Pick<BlogPost, 'title' | 'content' | 'images'>;
export type CreateBlog = Pick<BlogPost, 'title' | 'content'> & {
  slug?: string;
  images?: FileList;
};

export type UpdatePost = Pick<BlogPost, 'title' | 'content'> & {
  slug?: string;
  images?: FileList;
};

export type BlogpostApiResponse<TData> = {
  success?: boolean;
  posts?: TData;
};

type PopulateBlogpost = Omit<BlogPost, 'author'> & {
  author: {
    username: string;
  };
};

// User api
export type LoginUserResponse = Pick<User, '_id' | 'username' | 'images'>;
export type CheckAuthResponse = Pick<User, '_id' | 'username' | 'images' | 'about'>;
export type RegisterUserResponse = Pick<User, 'username' | 'images'> & {
  id: string;
};
export type UpdateUserResponse = Pick<User, '_id' | 'username' | 'images' | 'about'>;
export type VisitUserResponse = {
  user: User;
  posts: BlogPost;
};

// blogposts api
export type SearchTitleResponse = {
  blogpost: PopulateBlogpost[];
};
export type getAllPostResponse = {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
export type getSinglePostResponse = {
  post: BlogPost;
};
export type CreatePostResponse = {
  newPost: CreateBlog;
};
export type CurrentUserResponse = {
  ownPost: BlogPost[];
};
export type UpdatePostResponse = {
  updatedPost: Pick<BlogPost, 'title' | 'content'> & {
    slug?: string;
    images: FileList;
  };
};
export type DeletePostResponse = {
  deletedPost: BlogPost;
};

// api response
export type BackendResponse<TData = unknown> = {
  success: boolean;
  error?: string;
  message?: string;
} & TData;

//  Blogpost api response
// export type CreatePostResponse = BackendResponse<{ post: CreateBlog }>;
// export type PostResponse = BackendResponse<{ post: BlogPost }>;
// export type PostsResponse = BackendResponse<{
//   posts: BlogPost[];
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalPosts: number;
//     postsPerPage: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
// }>;
// export type UpdatePostResponse = BackendResponse<{ updatedPost: UpdatePost }>;
// export type GetCurrentLogPostReponse = BackendResponse<{ posts: BlogPost[] }>;
// export type DeletePostResponse = BackendResponse<{ deletedPost: BlogPost }>;
// export type SearchTitleResponse = BackendResponse<{ searchTitle: SearchTitle[] }>;

// user api response
// export type RegisterUserResponse = BackendResponse<{ user: RegisterUserData }>;
export type LoginPostResponse = BackendResponse<{ user: User }>;
// export type CheckAuthRespone = BackendResponse<{ user: User }>;
// export type VisitUserResponse = BackendResponse<{ user: User; posts: BlogPost[] }>;
// export type UpdateUserResponse = BackendResponse<{ user: CheckAuth }>;
