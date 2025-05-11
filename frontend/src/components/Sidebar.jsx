import { Link } from "react-router-dom";
import { Home, UserPlus, Bell, Eye, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ user }) {
	const [isPublic, setIsPublic] = useState(true);
	const [showVisibilitySettings, setShowVisibilitySettings] = useState(false);

	const handleVisibilityChange = () => {
		setIsPublic(!isPublic);
		// TODO: Implement visibility change logic
	};

	const toggleVisibilitySettings = () => {
		setShowVisibilitySettings(!showVisibilitySettings);
	};

	if (!user) {
		return null;
	}

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
				<p className="text-info small">{user.connections?.length || 0} connections</p>
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
						<li className="nav-item mb-2 bg-opacity-25 bg-dark rounded">
							<div 
								className="nav-link d-flex align-items-center justify-content-between text-white p-2 rounded cursor-pointer"
								onClick={toggleVisibilitySettings}
								style={{ cursor: 'pointer' }}
							>
								<div className="d-flex align-items-center">
									<Eye size={18} className="me-2" /> Visibility Settings
								</div>
								<ChevronDown 
									size={18} 
									className={`transition-transform ${showVisibilitySettings ? 'rotate-180' : ''}`}
									style={{ transition: 'transform 0.2s' }}
								/>
							</div>
							{showVisibilitySettings && (
								<div className="ms-4 mt-2 mb-2">
									<div className="d-flex align-items-center gap-3">
										<span className="small text-white-50">{isPublic ? "Public" : "Private"}</span>
										<div className="form-check form-switch">
											<input
												className="form-check-input"
												type="checkbox"
												role="switch"
												id="visibilitySwitch"
												checked={isPublic}
												onChange={handleVisibilityChange}
											/>
										</div>
									</div>
								</div>
							)}
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
