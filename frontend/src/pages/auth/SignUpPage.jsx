import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
	return (
		<div className="min-vh-100 d-flex flex-column justify-content-center py-5 px-3 bg-light">
			<div className="mx-auto w-100" style={{ maxWidth: "400px" }}>
				<div className="text-center mb-4">
					<img
						style={{ height: "160px" }}
						className="mx-auto d-block"
						src="/logo.svg"
						alt="LinkedIn"
					/>
					<h2 className="h4 fw-bold text-dark mt-3">
						Make the most of your professional life
					</h2>
				</div>

				<div className="card shadow-sm">
					<div className="card-body">
						<SignUpForm />

						<div className="my-4 text-center position-relative">
							<hr />
							<span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
								Already on LinkedIn?
							</span>
						</div>

						<div className="d-grid">
							<Link to="/login" className="btn btn-outline-primary">
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
