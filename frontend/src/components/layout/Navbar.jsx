import React from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { Home, Users, Bell, User, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: async () => axiosInstance.get("/connections/requests"),
		enabled: !!authUser,
	});

  const { mutate: logout, isLoading: isLoggingOut } = useMutation({
		mutationFn: async () => {
			try {
				await axiosInstance.post("/auth/logout");
			} catch (error) {
				console.error("Logout error:", error);
				throw error;
			}
		},
    onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			toast.success("Logged out successfully");
			navigate("/login");
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Failed to logout");
		}
	});

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  return (
    <nav className="bg-secondary shadow sticky-top z-10">
      <div className="container px-4">
        <div className="d-flex justify-content-between align-items-center py-3">
          
          {/* Sol Logo Alanı */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/">
              <img src="/small-logo.png" alt="LinkedIn" className="rounded" style={{ height: "32px" }} />
            </Link>
          </div>

          {/* Sağ Menü Alanı */}
          <div className="d-flex align-items-center gap-3 gap-md-4">
            {authUser ? (
              <>
                <Link to="/" className="text-light d-flex flex-column align-items-center text-decoration-none">
                  <Home size={20} />
                  <span className="small d-none d-md-block">Home</span>
                </Link>

                <Link to="/network" className="text-light d-flex flex-column align-items-center text-decoration-none position-relative">
                  <Users size={20} />
                  <span className="small d-none d-md-block">My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge bg-primary text-white rounded-pill p-1 px-2">
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>

                <Link to="/notifications" className="text-light d-flex flex-column align-items-center text-decoration-none position-relative">
                  <Bell size={20} />
                  <span className="small d-none d-md-block">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge bg-primary text-white rounded-pill p-1 px-2">
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>

                <Link to={`/profile/${authUser.username}`} className="text-light d-flex flex-column align-items-center text-decoration-none">
                  <User size={20} />
                  <span className="small d-none d-md-block">Me</span>
                </Link>

                <button
                  className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                >
                  <LogOut size={18} />
                  <span className="d-none d-md-inline text">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
