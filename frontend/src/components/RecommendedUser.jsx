import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";

const RecommendedUser = ({ user }) => {
	const queryClient = useQueryClient();

	const { data: connectionStatus, isLoading } = useQuery({
		queryKey: ["connectionStatus", user._id],
		queryFn: () => axiosInstance.get(`/connections/status/${user._id}`),
	});

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent successfully");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const handleConnect = () => {
		if (connectionStatus?.data?.status === "not_connected") {
			sendConnectionRequest(user._id);
		}
	};

	const renderButton = () => {
		if (isLoading) {
			return (
				<button className="btn btn-secondary btn-sm" disabled>
					Loading...
				</button>
			);
		}

		switch (connectionStatus?.data?.status) {
			case "pending":
				return (
					<button className="btn btn-warning btn-sm d-flex align-items-center" disabled>
						<Clock size={16} className="me-1" />
						Pending
					</button>
				);
			case "received":
				return (
					<div className="d-flex gap-2">
						<button
							onClick={() => acceptRequest(connectionStatus.data.requestId)}
							className="btn btn-success btn-sm"
						>
							<Check size={16} />
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.data.requestId)}
							className="btn btn-danger btn-sm"
						>
							<X size={16} />
						</button>
					</div>
				);
			case "connected":
				return (
					<button className="btn btn-success btn-sm d-flex align-items-center" disabled>
						<UserCheck size={16} className="me-1" />
						Connected
					</button>
				);
			default:
				return (
					<button
						className="btn btn-outline-primary btn-sm d-flex align-items-center"
						onClick={handleConnect}
					>
						<UserPlus size={16} className="me-1" />
						Connect
					</button>
				);
		}
	};

	return (
		<div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
			<Link to={`/profile/${user.username}`} className="d-flex align-items-center text-decoration-none text-dark flex-grow-1">
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className="rounded-circle me-3"
					style={{ width: "48px", height: "48px", objectFit: "cover" }}
				/>
				<div>
					<h6 className="mb-0">{user.name}</h6>
					<small className="text-muted">{user.headline}</small>
				</div>
			</Link>
			{renderButton()}
		</div>
	);
};

export default RecommendedUser;
