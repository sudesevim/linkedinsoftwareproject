import { Briefcase, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/dateUtils";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [experiences, setExperiences] = useState(userData.experience || []);
	const [newExperience, setNewExperience] = useState({
		title: "",
		company: "",
		startDate: "",
		endDate: "",
		description: "",
		currentlyWorking: false,
	});

	const handleAddExperience = () => {
		if (newExperience.title && newExperience.company && newExperience.startDate) {
			setExperiences([...experiences, newExperience]);
			setNewExperience({
				title: "",
				company: "",
				startDate: "",
				endDate: "",
				description: "",
				currentlyWorking: false,
			});
		}
	};

	const handleDeleteExperience = (id) => {
		setExperiences(experiences.filter((exp) => exp._id !== id));
	};

	const handleSave = () => {
		onSave({ experience: experiences });
		setIsEditing(false);
	};

	const handleCurrentlyWorkingChange = (e) => {
		setNewExperience({
			...newExperience,
			currentlyWorking: e.target.checked,
			endDate: e.target.checked ? "" : newExperience.endDate,
		});
	};

	return (
		<div className="card mb-4">
			<div className="card-body">
				<h2 className="card-title h5 mb-4">Experience</h2>

				{experiences.map((exp) => (
					<div key={exp._id} className="mb-3 d-flex justify-content-between align-items-start">
						<div className="d-flex">
							<Briefcase size={20} className="me-2 mt-1" />
							<div>
								<h5 className="fw-semibold mb-1">{exp.title}</h5>
								<p className="mb-0 text-muted">{exp.company}</p>
								<p className="mb-1 text-secondary small">
									{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
								</p>
								<p className="mb-0">{exp.description}</p>
							</div>
						</div>
						{isEditing && (
							<button onClick={() => handleDeleteExperience(exp._id)} className="btn btn-sm btn-outline-danger">
								<X size={18} />
							</button>
						)}
					</div>
				))}

				{isEditing && (
					<div className="mt-3">
						<input
							type="text"
							className="form-control mb-2"
							placeholder="Title"
							value={newExperience.title}
							onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
						/>
						<input
							type="text"
							className="form-control mb-2"
							placeholder="Company"
							value={newExperience.company}
							onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
						/>
						<input
							type="date"
							className="form-control mb-2"
							value={newExperience.startDate}
							onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
						/>
						<div className="form-check mb-2">
							<input
								type="checkbox"
								className="form-check-input"
								id="currentlyWorking"
								checked={newExperience.currentlyWorking}
								onChange={handleCurrentlyWorkingChange}
							/>
							<label className="form-check-label" htmlFor="currentlyWorking">
								I currently work here
							</label>
						</div>
						{!newExperience.currentlyWorking && (
							<input
								type="date"
								className="form-control mb-2"
								value={newExperience.endDate}
								onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
							/>
						)}
						<textarea
							className="form-control mb-3"
							placeholder="Description"
							value={newExperience.description}
							onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
						/>
						<button onClick={handleAddExperience} className="btn btn-primary">
							Add Experience
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
							<button onClick={() => setIsEditing(true)} className="btn btn-link p-0 text-decoration-none text-primary">
								Edit Experiences
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ExperienceSection;
