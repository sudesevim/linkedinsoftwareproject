import { School, X } from "lucide-react";
import { useState } from "react";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [educations, setEducations] = useState(userData.education || []);
	const [newEducation, setNewEducation] = useState({
		school: "",
		fieldOfStudy: "",
		startYear: "",
		endYear: "",
	});

	const handleAddEducation = () => {
		if (newEducation.school && newEducation.fieldOfStudy && newEducation.startYear) {
			setEducations([...educations, newEducation]);
			setNewEducation({
				school: "",
				fieldOfStudy: "",
				startYear: "",
				endYear: "",
			});
		}
	};

	const handleDeleteEducation = (id) => {
		setEducations(educations.filter((edu) => edu._id !== id));
	};

	const handleSave = () => {
		onSave({ education: educations });
		setIsEditing(false);
	};

	return (
		<div className="card mb-4">
			<div className="card-body">
				<h2 className="card-title h5 mb-4">Education</h2>

				{educations.map((edu) => (
					<div key={edu._id} className="mb-3 d-flex justify-content-between align-items-start">
						<div className="d-flex">
							<School size={20} className="me-2 mt-1" />
							<div>
								<h5 className="fw-semibold mb-1">{edu.fieldOfStudy}</h5>
								<p className="mb-0 text-muted">{edu.school}</p>
								<p className="mb-0 text-secondary small">
									{edu.startYear} - {edu.endYear || "Present"}
								</p>
							</div>
						</div>
						{isEditing && (
							<button onClick={() => handleDeleteEducation(edu._id)} className="btn btn-sm btn-outline-danger">
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
							placeholder="School"
							value={newEducation.school}
							onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
						/>
						<input
							type="text"
							className="form-control mb-2"
							placeholder="Field of Study"
							value={newEducation.fieldOfStudy}
							onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
						/>
						<input
							type="number"
							className="form-control mb-2"
							placeholder="Start Year"
							value={newEducation.startYear}
							onChange={(e) => setNewEducation({ ...newEducation, startYear: e.target.value })}
						/>
						<input
							type="number"
							className="form-control mb-3"
							placeholder="End Year"
							value={newEducation.endYear}
							onChange={(e) => setNewEducation({ ...newEducation, endYear: e.target.value })}
						/>
						<button onClick={handleAddEducation} className="btn btn-primary">
							Add Education
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
							<button onClick={() => setIsEditing(true)} className="btn btn-link text-decoration-none p-0 text-primary">
								Edit Education
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default EducationSection;
