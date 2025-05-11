import { X } from "lucide-react";
import { useState } from "react";

const SkillsSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [skills, setSkills] = useState(userData.skills || []);
	const [newSkill, setNewSkill] = useState("");

	const handleAddSkill = () => {
		if (newSkill && !skills.includes(newSkill)) {
			setSkills([...skills, newSkill]);
			setNewSkill("");
		}
	};

	const handleDeleteSkill = (skill) => {
		setSkills(skills.filter((s) => s !== skill));
	};

	const handleSave = () => {
		onSave({ skills });
		setIsEditing(false);
	};

	return (
		<div className="card mb-4">
			<div className="card-body">
				<h2 className="card-title h5 mb-4">Skills</h2>

				<div className="d-flex flex-wrap gap-2">
					{skills.map((skill, index) => (
						<span
							key={index}
							className="badge bg-light text-dark d-flex align-items-center pe-2"
							style={{ fontSize: "0.9rem" }}
						>
							{skill}
							{isEditing && (
								<button
									onClick={() => handleDeleteSkill(skill)}
									className="btn btn-sm btn-link text-danger ms-2 p-0 d-flex align-items-center"
								>
									<X size={14} />
								</button>
							)}
						</span>
					))}
				</div>

				{isEditing && (
					<div className="input-group mt-4">
						<input
							type="text"
							className="form-control"
							placeholder="New Skill"
							value={newSkill}
							onChange={(e) => setNewSkill(e.target.value)}
						/>
						<button onClick={handleAddSkill} className="btn btn-primary">
							Add Skill
						</button>
					</div>
				)}

				{isOwnProfile && (
					<div className="mt-4">
						{isEditing ? (
							<button onClick={handleSave} className="btn btn-success">
								Save Changes
							</button>
						) : (
							<button
								onClick={() => setIsEditing(true)}
								className="btn btn-link text-decoration-none text-primary p-0"
							>
								Edit Skills
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default SkillsSection;
