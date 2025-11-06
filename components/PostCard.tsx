import { useState, useEffect } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";

export interface PostCardProps {
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
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  isLiked?: boolean;
}

export const PostCard = ({
  id,
  author,
  content,
  likes,
  comments,
  createdAt,
  image,
  onLike,
  onComment,
  isLiked = false,
}: PostCardProps) => {
  const [isLikedOptimistic, setIsLikedOptimistic] = useState(isLiked);
  const [likesOptimistic, setLikesOptimistic] = useState(likes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setIsLikedOptimistic(isLiked);
      setLikesOptimistic(likes);
    } else {
      const timer = setTimeout(() => {
        setIsLikedOptimistic(isLiked);
        setLikesOptimistic(likes);
        setIsPending(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLiked, likes, isPending]);

  const handleLike = () => {
    if (onLike) {
      setIsAnimating(true);
      setIsPending(true);
      setTimeout(() => setIsAnimating(false), 400);
      const newLikedState = !isLikedOptimistic;
      setIsLikedOptimistic(newLikedState);
      setLikesOptimistic(prev => newLikedState ? prev + 1 : prev - 1);
      
      onLike(id);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start gap-3 mb-4">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
            {author.username[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold text-sm text-gray-900">@{author.username}</p>
          <p className="text-xs text-gray-500">{formatDate(createdAt)}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
        {image && (
          <img
            src={image}
            alt="Post image"
            className="w-full mt-3 rounded-lg object-cover max-h-96"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleLike}
          className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
            isAnimating ? 'animate-like' : ''
          } ${
            isLikedOptimistic
              ? 'bg-purple-50 border-purple-500 text-purple-700 hover:bg-purple-100'
              : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-black'
          }`}
        >
          <span className="flex items-center gap-1">
            <span className={isAnimating ? 'animate-like-icon inline-block' : 'inline-block'}>
              {isLikedOptimistic ? <AiFillLike /> : <AiOutlineLike />}
            </span>
            {likesOptimistic}
          </span>
        </button>
      </div>
    </article>
  );
};
