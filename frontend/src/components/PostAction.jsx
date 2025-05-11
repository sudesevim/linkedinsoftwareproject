
export default function PostAction({ icon, text, onClick }) {
	return (
		<button className="btn btn-link d-flex align-items-center p-0" onClick={onClick}>
			<span className="me-1">{icon}</span>
			<span className="d-none d-sm-inline">{text}</span>
		</button>
	);
}
