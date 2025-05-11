import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostAction from "./PostAction";
    
    const Post = ({ post }) => {
        const { postId } = useParams();
    
        const { data: authUser } = useQuery({ queryKey: ["authUser"] });
        const [showComments, setShowComments] = useState(false);
        const [newComment, setNewComment] = useState("");
        const [comments, setComments] = useState(post.comments || []);
        const isOwner = authUser._id === post.author._id;
        const isLiked = post.likes.includes(authUser._id);
    
        const queryClient = useQueryClient();
    
        const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
            mutationFn: async () => {
                await axiosInstance.delete(`/posts/delete/${post._id}`);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                toast.success("Post deleted successfully");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    

        const { mutate: createComment, isPending: isAddingComment } = useMutation({
            mutationFn: async (newComment) => {
                await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment });
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                toast.success("Comment added successfully");
            },
            onError: (err) => {
                toast.error(err.response.data.message || "Failed to add comment");
            },
        });

        const { mutate: likePost, isPending: isLikingPost } = useMutation({
            mutationFn: async () => {
                await axiosInstance.post(`/posts/${post._id}/like`);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                queryClient.invalidateQueries({ queryKey: ["post", postId] });
            },
        });

        const handleDeletePost = () => {
            if (!window.confirm("Are you sure you want to delete this post?")) return;
            deletePost();
        };
    
        const handleLikePost = async () => {
            if (isLikingPost) return;
            likePost();
        };

        const handleAddComment = async (e) => {
            e.preventDefault();
            if (newComment.trim()) {
                createComment(newComment);
                setNewComment("");
                setComments([
                    ...comments,
                    {
                        content: newComment,
                        user: {
                            _id: authUser._id,
                            name: authUser.name,
                            profilePicture: authUser.profilePicture,
                        },
                        createdAt: new Date(),
                    },
                ]);
            }
        };

        return (
            <div className="card bg-light rounded shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-start">
                            <Link to={`/profile/${post?.author?.username}`}>
                                <img
                                    src={post.author.profilePicture || "/avatar.png"}
                                    alt={post.author.name}
                                    className="rounded-circle me-3"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                            </Link>
                            <div>
                                <Link to={`/profile/${post?.author?.username}`} className="text-decoration-none text-dark">
                                    <h5 className="fw-semibold mb-0">{post.author.name}</h5>
                                </Link>
                                <p className="text-muted small mb-0">{post.author.headline}</p>
                                <p className="text-muted small">
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
    
                        {isOwner && (
                            <button onClick={handleDeletePost} className="btn btn-link text-danger p-0">
                                {isDeletingPost ? <Loader size={18} className="spinner-border spinner-border-sm" /> : <Trash2 size={18} />}
                            </button>
                        )}
                    </div>
    
                    <p className="mb-3">{post.content}</p>
    
                    {post.image && (
                        <img
                            src={post.image}
                            alt="Post content"
                            className="img-fluid rounded mb-3"
                        />
                    )}
    
                    <div className="d-flex justify-content-between text-primary">
                        <PostAction
                            icon={
                                <ThumbsUp
                                    size={18}
                                    className={isLiked ? "text-primary" : ""}
                                />
                            }
                            text={`Like (${post.likes.length})`}
                            onClick={handleLikePost}
                        />
    
                        <PostAction
                            icon={<MessageCircle size={18} />}
                            text={`Comment (${comments.length})`}
                            onClick={() => setShowComments(!showComments)}
                        />
    
                        <PostAction
                            icon={<Share2 size={18} />}
                            text="Share"
                        />
                    </div>
                </div>
    
                {showComments && (
                    <div className="px-3 pb-3">
                        <div className="mb-3" style={{ maxHeight: "240px", overflowY: "auto" }}>
                            {comments.map((comment) => (
                                <div key={comment._id} className="d-flex mb-2 bg-white p-2 rounded">
                                    <img
                                        src={comment.user.profilePicture || "/avatar.png"}
                                        alt={comment.user.name}
                                        className="rounded-circle me-2"
                                        style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center mb-1">
                                            <span className="fw-semibold me-2">{comment.user.name}</span>
                                            <span className="text-muted small">
                                                {formatDistanceToNow(new Date(comment.createdAt))}
                                            </span>
                                        </div>
                                        <p className="mb-0">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
    
                        <form onSubmit={handleAddComment} className="d-flex align-items-center">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="form-control me-2 rounded-start-pill"
                            />
    
                            <button
                                type="submit"
                                className="btn btn-primary rounded-end-pill px-3"
                                disabled={isAddingComment}
                            >
                                {isAddingComment ? (
                                    <Loader size={18} className="spinner-border spinner-border-sm" />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        );
    };
    
    export default Post;
