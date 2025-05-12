import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
	const [email, setEmail] = useState("");
	const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: loginMutation, isLoading } = useMutation({
		mutationFn: async (userData) => {
			try {
				const response = await axiosInstance.post("/auth/login", userData);
				return response.data;
			} catch (error) {
				console.error("Login error:", error);
				throw error;
			}
		},
		onSuccess: async () => {
			// Invalidate and refetch auth user data
			await queryClient.invalidateQueries({ queryKey: ["authUser"] });
			toast.success("Logged in successfully!");
			// Navigate to home page
			navigate("/");
		},
		onError: (err) => {
			const errorMessage = err.response?.data?.message || "Failed to login. Please check your credentials.";
			setError(errorMessage);
			toast.error(errorMessage);
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		setError(""); // Clear any previous errors
		if (!username || !password) {
			setError("Please fill in all fields");
			return;
		}
		loginMutation({ username, password });
	};

	const handleForgotPassword = async (e) => {
		e.preventDefault();
		if (!email) {
			toast.error("Please enter your email address");
			return;
		}

		try {
			setIsSendingResetEmail(true);
			await axiosInstance.post("/auth/forgot-password", { email });
			toast.success("Password reset email sent. Please check your inbox.");
			setShowForgotPasswordModal(false);
			setEmail("");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to send reset email");
		} finally {
			setIsSendingResetEmail(false);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
				{error && (
					<div className="alert alert-danger py-2 px-3">
						{error}
					</div>
				)}
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="form-control bg-light"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="form-control bg-light"
					required
				/>
				<button 
					type="submit" 
					disabled={isLoading} 
					className="btn btn-primary w-100"
				>
					{isLoading ? (
						<>
							<Loader className="spinner-border spinner-border-sm me-2" />
							Logging in...
						</>
					) : (
						"Sign in"
					)}
				</button>
				<button
					type="button"
					className="btn btn-link p-0"
					onClick={() => setShowForgotPasswordModal(true)}
				>
					Forgot password?
				</button>
			</form>

			{/* Forgot Password Modal */}
			{showForgotPasswordModal && (
				<div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header border-bottom-0">
								<h5 className="modal-title fw-bold">Reset Password</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setShowForgotPasswordModal(false)}
								></button>
							</div>
							<div className="modal-body">
								<p className="text-muted mb-4">Enter your email address and we'll send you a link to reset your password.</p>
								<form onSubmit={handleForgotPassword}>
									<div className="mb-4">
										<label htmlFor="reset-email" className="form-label">Email address</label>
										<input
											id="reset-email"
											type="email"
											className="form-control bg-light"
											placeholder="Enter your email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<div className="d-flex justify-content-end gap-2">
										<button
											type="button"
											className="btn btn-light"
											onClick={() => setShowForgotPasswordModal(false)}
										>
											Cancel
										</button>
										<button
											type="submit"
											className="btn btn-primary"
											disabled={isSendingResetEmail}
										>
											{isSendingResetEmail ? (
												<>
													<Loader className="spinner-border spinner-border-sm me-2" />
													Sending...
												</>
											) : (
												"Send Reset Link"
											)}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default LoginForm;
