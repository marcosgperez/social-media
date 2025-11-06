export interface Post {
  id: string;
  author: {
    username: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  image?: string;
  isLiked?: boolean;
}
