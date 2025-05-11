import { useState } from "react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [about, setAbout] = useState(userData.about || "");

	const handleSave = () => {
		setIsEditing(false);
		onSave({ about });
	};

	return (
		<div className='card mb-4'>
			<div className='card-body'>
				<h2 className='card-title h5 mb-3'>About</h2>

				{isOwnProfile && (
					<>
						{isEditing ? (
							<>
								<textarea
									value={about}
									onChange={(e) => setAbout(e.target.value)}
									className='form-control mb-2'
									rows='4'
								/>
								<button
									onClick={handleSave}
									className='btn btn-primary'
								>
									Save
								</button>
							</>
						) : (
							<>
								<p className='card-text'>{userData.about || "No description provided."}</p>
								<button
									onClick={() => setIsEditing(true)}
									className='btn btn-link p-0 mt-2 text-decoration-none text-primary'
								>
									Edit
								</button>
							</>
						)}
					</>
				)}

				{!isOwnProfile && <p className='card-text'>{userData.about}</p>}
			</div>
		</div>
	);
};

export default AboutSection;
