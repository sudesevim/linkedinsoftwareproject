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
			// Fetch the updated user data
			const userData = await queryClient.fetchQuery({ queryKey: ["authUser"] });
			toast.success("Logged in successfully!");
			// Navigate to profile page
			navigate(`/profile/${userData.username}`);
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

	return (
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
		</form>
	);
};

export default LoginForm;
