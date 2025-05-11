import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => axiosInstance.get("/notifications"),
	});

	const { mutate: markAsReadMutation } = useMutation({
		mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
		},
	});

	const { mutate: deleteNotificationMutation } = useMutation({
		mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
			toast.success("Notification deleted");
		},
	});

	const renderNotificationIcon = (type) => {
		switch (type) {
			case "like":
				return <ThumbsUp className="text-primary" />;
			case "comment":
				return <MessageSquare className="text-success" />;
			case "connectionAccepted":
				return <UserPlus className="text-info" />;
			default:
				return null;
		}
	};

	const renderNotificationContent = (notification) => {
		switch (notification.type) {
			case "like":
				return <strong>{notification.relatedUser.name}</strong> + " liked your post";
			case "comment":
				return (
					<>
						<Link to={`/profile/${notification.relatedUser.username}`} className="fw-bold text-decoration-none">
							{notification.relatedUser.name}
						</Link>{" "}
						commented on your post
					</>
				);
			case "connectionAccepted":
				return (
					<>
						<Link to={`/profile/${notification.relatedUser.username}`} className="fw-bold text-decoration-none">
							{notification.relatedUser.name}
						</Link>{" "}
						accepted your connection request
					</>
				);
			default:
				return null;
		}
	};

	const renderRelatedPost = (relatedPost) => {
		if (!relatedPost) return null;

		return (
			<Link
				to={`/post/${relatedPost._id}`}
				className="d-flex align-items-center border rounded p-2 mt-2 text-decoration-none text-muted"
				style={{ backgroundColor: "#f8f9fa" }}
			>
				{relatedPost.image && (
					<img
						src={relatedPost.image}
						alt="Post preview"
						className="me-2 rounded"
						style={{ width: "40px", height: "40px", objectFit: "cover" }}
					/>
				)}
				<div className="flex-grow-1 text-truncate">{relatedPost.content}</div>
				<ExternalLink size={14} className="ms-2 text-secondary" />
			</Link>
		);
	};

	return (
		<div className="container mt-4">
			<div className="row g-4">
				<div className="col-lg-3">
					<Sidebar user={authUser} />
				</div>
				<div className="col-lg-9">
					<div className="card shadow-sm">
						<div className="card-body">
							<h2 className="h4 mb-4">Notifications</h2>

							{isLoading ? (
								<p>Loading notifications...</p>
							) : notifications && notifications.data.length > 0 ? (
								<ul className="list-unstyled">
									{notifications.data.map((notification) => (
										<li
											key={notification._id}
											className={`card mb-3 p-3 ${
												!notification.read ? "border-primary" : "border-secondary"
											}`}
										>
											<div className="d-flex justify-content-between align-items-start">
												<div className="d-flex align-items-start gap-3">
													<Link to={`/profile/${notification.relatedUser.username}`}>
														<img
															src={notification.relatedUser.profilePicture || "/avatar.png"}
															alt={notification.relatedUser.name}
															className="rounded-circle"
															style={{ width: "48px", height: "48px", objectFit: "cover" }}
														/>
													</Link>

													<div>
														<div className="d-flex align-items-center gap-2 mb-1">
															<div className="p-1 bg-light rounded-circle d-flex align-items-center justify-content-center">
																{renderNotificationIcon(notification.type)}
															</div>
															<div className="small">{renderNotificationContent(notification)}</div>
														</div>
														<p className="text-muted small mb-1">
															{formatDistanceToNow(new Date(notification.createdAt), {
																addSuffix: true,
															})}
														</p>
														{renderRelatedPost(notification.relatedPost)}
													</div>
												</div>

												<div className="d-flex gap-2">
													{!notification.read && (
														<button
															onClick={() => markAsReadMutation(notification._id)}
															className="btn btn-outline-primary btn-sm"
															title="Mark as read"
														>
															<Eye size={16} />
														</button>
													)}

													<button
														onClick={() => deleteNotificationMutation(notification._id)}
														className="btn btn-outline-danger btn-sm"
														title="Delete"
													>
														<Trash2 size={16} />
													</button>
												</div>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p>No notification at the moment.</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationsPage;
