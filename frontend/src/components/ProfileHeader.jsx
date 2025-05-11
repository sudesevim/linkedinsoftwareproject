import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
		queryKey: ["connectionStatus", userData._id],
		queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
		enabled: !isOwnProfile,
	});

	const isConnected = userData.connections.some((connection) => connection === authUser._id);

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: removeConnection } = useMutation({
		mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
		onSuccess: () => {
			toast.success("Connection removed");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const getConnectionStatus = useMemo(() => {
		if (isConnected) return "connected";
		if (!isConnected) return "not_connected";
		return connectionStatus?.data?.status;
	}, [isConnected, connectionStatus]);

	const renderConnectionButton = () => {
		switch (getConnectionStatus) {
			case "connected":
				return (
					<div className="d-flex gap-2 justify-content-center">
						<div className="btn btn-success d-flex align-items-center">
							<UserCheck size={20} className="me-2" />
							Connected
						</div>
						<button
							className="btn btn-danger d-flex align-items-center"
							onClick={() => removeConnection(userData._id)}
						>
							<X size={20} className="me-2" />
							Remove
						</button>
					</div>
				);
			case "pending":
				return (
					<button className="btn btn-warning d-flex align-items-center">
						<Clock size={20} className="me-2" />
						Pending
					</button>
				);
			case "received":
				return (
					<div className="d-flex gap-2 justify-content-center">
						<button
							onClick={() => acceptRequest(connectionStatus.data.requestId)}
							className="btn btn-success"
						>
							Accept
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.data.requestId)}
							className="btn btn-danger"
						>
							Reject
						</button>
					</div>
				);
			default:
				return (
					<button
						onClick={() => sendConnectionRequest(userData._id)}
						className="btn btn-primary d-flex align-items-center"
					>
						<UserPlus size={20} className="me-2" />
						Connect
					</button>
				);
		}
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		onSave(editedData);
		setIsEditing(false);
	};

	return (
		<div className="card mb-4">
			<div
				className="card-img-top position-relative"
				style={{
					height: "200px",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundImage: `url('${editedData.bannerImg || userData.bannerImg || "/banner.png"}')`,
				}}
			>
				{isEditing && (
					<label className="position-absolute top-0 end-0 m-2 bg-white p-2 rounded-circle shadow-sm">
						<Camera size={20} />
						<input
							type="file"
							className="d-none"
							name="bannerImg"
							onChange={handleImageChange}
							accept="image/*"
						/>
					</label>
				)}
			</div>

			<div className="card-body text-center">
				<div className="position-relative" style={{ marginTop: "-80px", marginBottom: "20px" }}>
					<img
						src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
						alt={userData.name}
						className="rounded-circle border border-3"
						style={{ width: "128px", height: "128px", objectFit: "cover" }}
					/>
					{isEditing && (
						<label className="position-absolute bottom-0 end-0 bg-white p-2 rounded-circle shadow-sm translate-middle">
							<Camera size={20} />
							<input
								type="file"
								className="d-none"
								name="profilePicture"
								onChange={handleImageChange}
								accept="image/*"
							/>
						</label>
					)}
				</div>

				{isEditing ? (
					<>
						<input
							type="text"
							className="form-control mb-2 text-center"
							value={editedData.name ?? userData.name}
							onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
						/>
						<input
							type="text"
							className="form-control mb-2 text-center"
							value={editedData.headline ?? userData.headline}
							onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
						/>
						<div className="d-flex justify-content-center align-items-center mb-2 text-secondary">
							<MapPin size={16} className="me-2" />
							<input
								type="text"
								className="form-control w-auto text-center"
								value={editedData.location ?? userData.location}
								onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
							/>
						</div>
					</>
				) : (
					<>
						<h4 className="mb-1">{userData.name}</h4>
						<p className="text-muted">{userData.headline}</p>
						<div className="d-flex justify-content-center align-items-center text-secondary">
							<MapPin size={16} className="me-2" />
							<span>{userData.location}</span>
						</div>
					</>
				)}

				<div className="mt-4">
					{isOwnProfile ? (
						isEditing ? (
							<button className="btn btn-primary w-100" onClick={handleSave}>
								Save Profile
							</button>
						) : (
							<button className="btn btn-primary w-100" onClick={() => setIsEditing(true)}>
								Edit Profile
							</button>
						)
					) : (
						renderConnectionButton()
					)}
				</div>
			</div>
		</div>
	);
};
export default ProfileHeader;
