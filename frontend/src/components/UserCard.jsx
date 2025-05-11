import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
	return (
		<div className="card text-center h-100 shadow-sm">
			<div className="card-body d-flex flex-column align-items-center">
				<Link to={`/profile/${user.username}`} className="text-decoration-none text-dark mb-3">
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className="rounded-circle mb-3"
						style={{ width: "96px", height: "96px", objectFit: "cover" }}
					/>
					<h5 className="card-title mb-0">{user.name}</h5>
				</Link>
				<p className="text-muted small mb-1">{user.headline}</p>
				<p className="text-muted small">{user.connections?.length} connections</p>

				<button className={`btn btn-sm mt-3 w-100 ${isConnection ? "btn-outline-success" : "btn-primary"}`}>
					{isConnection ? "Connected" : "Connect"}
				</button>
			</div>
		</div>
	);
}

export default UserCard;
