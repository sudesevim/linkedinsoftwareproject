import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2, Edit2, X, Image, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostAction from "./PostAction";

const Post = ({ post }) => {
    const { postId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [editedImage, setEditedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(post.image);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(post.comments || []);
    const isOwner = authUser._id === post.author._id;
    const isLiked = post.likes.includes(authUser._id);

    const queryClient = useQueryClient();

    const { mutate: updatePost, isPending: isUpdating } = useMutation({
        mutationFn: async () => {
            const postData = { content: editedContent };
            if (editedImage) {
                postData.image = await readFileAsDataURL(editedImage);
            }
            await axiosInstance.put(`/posts/update/${post._id}`, postData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
            setIsEditing(false);
            toast.success("Post updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update post");
        },
    });

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

    const { mutate: reportPost, isPending: isReporting } = useMutation({
        mutationFn: async () => {
            await axiosInstance.post(`/posts/${post._id}/report`, { reason: reportReason });
        },
        onSuccess: () => {
            toast.success("Post reported successfully");
            setShowReportModal(false);
            setReportReason("");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to report post");
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

    const handleSharePost = async () => {
        try {
            const postUrl = `${window.location.origin}/post/${post._id}`;
            await navigator.clipboard.writeText(postUrl);
            toast.success("Post link copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy post link");
        }
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEditedImage(file);
        if (file) {
            readFileAsDataURL(file).then(setImagePreview);
        } else {
            setImagePreview(post.image);
        }
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleUpdatePost = () => {
        if (!editedContent.trim()) {
            toast.error("Post content cannot be empty");
            return;
        }
        updatePost();
    };

    const handleReportPost = () => {
        if (!reportReason.trim()) {
            toast.error("Please provide a reason for reporting");
            return;
        }
        reportPost();
    };

    return (
        <div className="card bg-white rounded shadow-sm mb-4">
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
                        <div className="d-flex gap-2">
                            <button onClick={() => setIsEditing(!isEditing)} className="btn btn-link text-primary p-0">
                                {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                            </button>
                            <button onClick={handleDeletePost} className="btn btn-link text-danger p-0">
                                {isDeletingPost ? <Loader size={18} className="spinner-border spinner-border-sm" /> : <Trash2 size={18} />}
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="mb-3">
                        <textarea
                            className="form-control mb-3"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows="3"
                        />
                        <div className="mb-3">
                            <label className="btn btn-outline-primary d-flex align-items-center">
                                <Image size={18} className="me-2" />
                                <span>Change Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                        {imagePreview && (
                            <div className="mb-3">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: "200px" }}
                                />
                            </div>
                        )}
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(post.content);
                                    setEditedImage(null);
                                    setImagePreview(post.image);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleUpdatePost}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader size={18} className="spinner-border spinner-border-sm" />
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="mb-3">{post.content}</p>
                        {post.image && (
                            <img
                                src={post.image}
                                alt="Post content"
                                className="img-fluid rounded mb-3"
                            />
                        )}
                    </>
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
                        onClick={handleSharePost}
                    />

                    {!isOwner && (
                        <PostAction
                            icon={<Flag size={18} />}
                            text="Report"
                            onClick={() => setShowReportModal(true)}
                        />
                    )}
                </div>
            </div>

            {showReportModal && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Report Post</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowReportModal(false);
                                        setReportReason("");
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="reportReason" className="form-label">
                                        Reason for reporting
                                    </label>
                                    <textarea
                                        id="reportReason"
                                        className="form-control"
                                        rows="3"
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        placeholder="Please explain why you are reporting this post..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowReportModal(false);
                                        setReportReason("");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleReportPost}
                                    disabled={isReporting}
                                >
                                    {isReporting ? (
                                        <Loader size={18} className="spinner-border spinner-border-sm" />
                                    ) : (
                                        "Submit Report"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showReportModal && (
                <div className="modal-backdrop fade show"></div>
            )}

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
