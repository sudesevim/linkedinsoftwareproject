import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate: signUpMutation, isLoading } = useMutation({
		mutationFn: async (data) => {
			try {
				const response = await axiosInstance.post("/auth/signup", data);
				return response.data;
			} catch (error) {
				console.error("Signup error:", error);
				throw error;
			}
		},
		onSuccess: async (data) => {
			toast.success("Account created successfully!");
			queryClient.setQueryData(["authUser"], data.user);
			navigate(`/profile/${data.user.username}`);
		  },		  
		onError: (err) => {
			const errorMsg = err?.response?.data?.message || "Something went wrong!";
			setErrorMessage(errorMsg);
			toast.error(errorMsg);
		},
	});

	const handleSignUp = (e) => {
		e.preventDefault();
		setErrorMessage(""); // Clear any previous error messages
		
		// Validate form fields
		if (!name || !email || !username || !password) {
			setErrorMessage("Please fill in all fields");
			return;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setErrorMessage("Please enter a valid email address");
			return;
		}

		// Validate password length
		if (password.length < 6) {
			setErrorMessage("Password must be at least 6 characters long");
			return;
		}

		signUpMutation({ name, username, email, password });
	};

	return (
		<form onSubmit={handleSignUp} className="d-flex flex-column gap-3">
			{errorMessage && (
				<div className="alert alert-danger py-2 px-3">
					{errorMessage}
				</div>
			)}

			<input
				type="text"
				placeholder="Full name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="form-control bg-light"
				required
			/>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className="form-control bg-light"
				required
			/>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="form-control bg-light"
				required
			/>
			<input
				type="password"
				placeholder="Password (6+ characters)"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="form-control bg-light"
				required
				minLength={6}
			/>

			<button 
				type="submit" 
				disabled={isLoading} 
				className="btn btn-primary mt-3"
			>
				{isLoading ? (
					<>
						<Loader className="spinner-border spinner-border-sm me-2" />
						Creating account...
					</>
				) : (
					"Agree & Join"
				)}
			</button>
		</form>
	);
};

export default SignUpForm;
