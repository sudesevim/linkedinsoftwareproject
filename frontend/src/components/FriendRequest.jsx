import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ request }) => {
	const queryClient = useQueryClient();

	const { mutate: acceptConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response.data.error);
		},
	});

	const { mutate: rejectConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response.data.error);
		},
	});

	return (
		<div className="card mb-3 shadow-sm">
			<div className="card-body d-flex justify-content-between align-items-center">
				<div className="d-flex align-items-center gap-3">
					<Link to={`/profile/${request.sender.username}`}>
						<img
							src={request.sender.profilePicture || "/avatar.png"}
							alt={request.name}
							className="rounded-circle"
							style={{ width: "64px", height: "64px", objectFit: "cover" }}
						/>
					</Link>
					<div>
						<Link to={`/profile/${request.sender.username}`} className="fw-semibold text-decoration-none text-dark">
							{request.sender.name}
						</Link>
						<p className="text-muted mb-0">{request.sender.headline}</p>
					</div>
				</div>

				<div className="btn-group">
					<button
						className="btn btn-primary"
						onClick={() => acceptConnectionRequest(request._id)}
					>
						Accept
					</button>
					<button
						className="btn btn-outline-secondary"
						onClick={() => rejectConnectionRequest(request._id)}
					>
						Reject
					</button>
				</div>
			</div>
		</div>
	);
};

export default FriendRequest;
