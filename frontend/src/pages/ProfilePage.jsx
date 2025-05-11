import { useParams, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";

const ProfilePage = () => {
	const { username } = useParams();
	const queryClient = useQueryClient();

	const { data: authUser, isLoading: isAuthLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get("/auth/me");
				return response.data;
			} catch (error) {
				console.error("Error fetching auth user:", error);
				return null;
			}
		},
	});

	const { 
		data: userProfile, 
		isLoading: isUserProfileLoading,
		error: userProfileError 
	} = useQuery({
		queryKey: ["userProfile", username],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get(`/users/${username}`);
				return response.data;
			} catch (error) {
				console.error("Error fetching user profile:", error);
				throw error;
			}
		},
		enabled: !!username
	});

	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
			queryClient.invalidateQueries(["authUser"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Failed to update profile");
		}
	});

	// Show loading spinner while either auth or profile data is loading
	if (isAuthLoading || isUserProfileLoading) {
		return (
			<div className="d-flex justify-content-center align-items-center min-vh-100">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!authUser) {
		toast.error("Please login to view profiles");
		return <Navigate to="/login" />;
	}

	// Show error message if profile fetch failed
	if (userProfileError) {
		return (
			<div className="d-flex justify-content-center align-items-center min-vh-100">
				<div className="alert alert-danger" role="alert">
					{userProfileError.response?.data?.message || "Failed to load profile"}
				</div>
			</div>
		);
	}

	// If we have the data, show the profile
	if (userProfile) {
		const isOwnProfile = authUser.username === userProfile.username;
		const userData = isOwnProfile ? authUser : userProfile;

		return (
			<div className='max-w-4xl mx-auto p-4'>
				<div className="row justify-content-center">
					<div className="col-md-6">
						<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={updateProfile} />
						<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={updateProfile} />
						<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={updateProfile} />
						<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={updateProfile} />
						<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={updateProfile} />
					</div>
				</div>
			</div>
		);
	}

	// Fallback for any other case
	return (
		<div className="d-flex justify-content-center align-items-center min-vh-100">
			<div className="alert alert-warning" role="alert">
				Unable to load profile data
			</div>
		</div>
	);
};

export default ProfilePage;