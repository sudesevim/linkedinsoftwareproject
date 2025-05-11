import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { UserPlus } from "lucide-react";
import FriendRequest from "../components/FriendRequest";
import UserCard from "../components/UserCard";

const NetworkPage = () => {
	const { data: user } = useQuery({ queryKey: ["authUser"] });

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: () => axiosInstance.get("/connections/requests"),
	});

	const { data: connections } = useQuery({
		queryKey: ["connections"],
		queryFn: () => axiosInstance.get("/connections"),
	});

	return (
		<div className="container mt-4">
			<div className="row g-4">
				<div className="col-lg-3">
					<Sidebar user={user} />
				</div>
				<div className="col-lg-9">
					<div className="card bg-light shadow-sm mb-4">
						<div className="card-body">
							<h1 className="h4 mb-4 fw-bold">My Network</h1>

							{connectionRequests?.data?.length > 0 ? (
								<div className="mb-5">
									<h2 className="h5 mb-3 fw-semibold">Connection Requests</h2>
									<div className="d-flex flex-column gap-3">
										{connectionRequests.data.map((request) => (
											<FriendRequest key={request.id} request={request} />
										))}
									</div>
								</div>
							) : (
								<div className="card text-center mb-5">
									<div className="card-body">
										<UserPlus size={48} className="text-secondary mb-3" />
										<h3 className="h5 fw-semibold mb-2">No Connection Requests</h3>
										<p className="text-muted mb-1">
											You don’t have any pending connection requests at the moment.
										</p>
										<p className="text-muted">
											Explore suggested connections below to expand your network!
										</p>
									</div>
								</div>
							)}

							{connections?.data?.length > 0 && (
								<div className="mb-3">
									<h2 className="h5 fw-semibold mb-3">My Connections</h2>
									<div className="row g-3">
										{connections.data.map((connection) => (
											<div className="col-12 col-md-6 col-lg-4" key={connection._id}>
												<UserCard user={connection} isConnection={true} />
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NetworkPage;
