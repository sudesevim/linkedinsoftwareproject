import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
	return (
		<div className="min-vh-100 d-flex flex-column justify-content-center py-5 px-3 bg-light">
			<div className="mx-auto w-100" style={{ maxWidth: "400px" }}>
				<div className="text-center mb-4">
					<img src="/logo.svg" alt="LinkedIn" style={{ height: "160px" }} className="mx-auto d-block" />
					<h2 className="h4 fw-bold text-dark mt-3">Sign in to your account</h2>
				</div>

				<div className="card shadow-sm">
					<div className="card-body">
						<LoginForm />

						<div className="my-4 position-relative text-center">
							<hr />
							<span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
								New to LinkedIn?
							</span>
						</div>

						<div className="d-grid">
							<Link
								to="/signup"
								className="btn btn-outline-primary"
							>
								Join now
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
