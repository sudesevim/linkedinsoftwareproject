import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

const PostCreation = ({ user }) => {
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	const queryClient = useQueryClient();

	const { mutate: createPostMutation, isPending } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.post("/posts/create", postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Failed to create post");
		},
	});

	const handlePostCreation = async () => {
		try {
			const postData = { content };
			if (image) postData.image = await readFileAsDataURL(image);
			createPostMutation(postData);
		} catch (error) {
			console.error("Error in handlePostCreation:", error);
		}
	};

	const resetForm = () => {
		setContent("");
		setImage(null);
		setImagePreview(null);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			readFileAsDataURL(file).then(setImagePreview);
		} else {
			setImagePreview(null);
		}
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	if (!user) return null;

	return (
		<div className="card bg-light rounded shadow-sm mb-4 p-3">
			<div className="d-flex mb-3 gap-3">
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className="rounded-circle border"
					style={{ width: "48px", height: "48px", objectFit: "cover" }}
				/>
				<textarea
					placeholder="What's on your mind?"
					className="form-control"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					style={{ minHeight: "100px", resize: "none" }}
				/>
			</div>

			{imagePreview && (
				<div className="mb-3 text-center">
					<img
						src={imagePreview}
						alt="Preview"
						className="img-fluid rounded"
						style={{ maxHeight: "200px" }}
					/>
				</div>
			)}

			<div className="d-flex justify-content-between align-items-center">
				<label className="btn btn-outline-primary d-flex align-items-center">
					<Image size={18} className="me-2" />
					<span>Photo</span>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						style={{ display: "none" }}
					/>
				</label>

				<button
					className="btn btn-primary"
					onClick={handlePostCreation}
					disabled={isPending}
				>
					{isPending ? (
						<Loader className="me-2 spinner-border spinner-border-sm" />
					) : (
						"Share"
					)}
				</button>
			</div>
		</div>
	);
};

export default PostCreation;
