import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
	return (
		<div className="bg-secondary text-white rounded shadow-sm overflow-hidden p-2">
			<div className="text-center mt-5">
				{/*<div
					className="bg-cover bg-center"
					style={{
						backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
						height: "100px",
					}}
				/> */}
				<Link to={`/profile/${user.username}`} className="text-decoration-none text-white">
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className="rounded-circle border border-light mt-n5"
						style={{ width: "80px", height: "80px" }}
					/>
					<h5 className="mt-2 mb-0">{user.name}</h5>
				</Link>
				<p className="text-info mb-1 mt-2">{user.headline}</p>
				<p className="text-info small">{user.connections.length} connections</p>
			</div>

			<hr className="border-light m-0" />

			<div className="p-3">
				<nav>
					<ul className="nav flex-column">
						<li className="nav-item mb-2">
							<Link to="/" className="nav-link d-flex align-items-center text-white p-2 rounded bg-opacity-25 bg-dark">
								<Home size={18} className="me-2" /> Home
							</Link>
						</li>
						<li className="nav-item mb-2">
							<Link to="/network" className="nav-link d-flex align-items-center text-white p-2 rounded bg-opacity-25 bg-dark">
								<UserPlus size={18} className="me-2" /> My Network
							</Link>
						</li>
						<li className="nav-item mb-2">
							<Link to="/notifications" className="nav-link d-flex align-items-center text-white p-2 rounded bg-opacity-25 bg-dark">
								<Bell size={18} className="me-2" /> Notifications
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			<hr className="border-light m-0"/>

			<div className="p-3 text-center">
				<Link to={`/profile/${user.username}`} className="text-white small fw-semibold">
					Visit your profile
				</Link>
			</div>
		</div>
	);
}
