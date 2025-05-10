import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { axiosInstance } from '../lib/axios';


const PostCreation = ({ user }) => {
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	const queryClient = useQueryClient();

	const { mutate: createPostMutation } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.post("/posts/create", postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Post created successfully");
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Failed to create post");
		},
	});

	const handlePostCreation = async () => {
		try {
			const postData = { content };
			if (image) postData.image = image;

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

    
	return (
		<div className="card bg-light rounded shadow mb-4 p-3">
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
				<input type="file" className="form-control w-50" onChange={handleImageChange} />
				<button className="btn btn-primary ms-3" onClick={handlePostCreation}>
					Post
				</button>
			</div>
		</div>
	);
};

export default PostCreation;
