import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { mutate: requestReset, isLoading } = useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post("/auth/request-password-reset", data);
            return response.data;
        },
        onSuccess: () => {
            setSuccess(true);
            toast.success("Password reset email sent");
        },
        onError: (error) => {
            setError(error.response?.data?.message || "Failed to send reset email");
            toast.error(error.response?.data?.message || "Failed to send reset email");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        requestReset({ email });
    };

    if (!isOpen) return null;

    return (
        <div 
            className="modal fade show" 
            style={{ 
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1050
            }} 
            tabIndex="-1"
        >
            <div 
                className="modal-dialog modal-dialog-centered"
                style={{
                    maxWidth: "500px",
                    margin: "1.75rem auto"
                }}
            >
                <div className="modal-content shadow-lg">
                    <div className="modal-header border-bottom">
                        <h5 className="modal-title fw-bold">Reset Your Password</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body p-4">
                        {success ? (
                            <div className="text-center">
                                <div className="alert alert-success mb-4">
                                    Password reset instructions have been sent to your email.
                                </div>
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                {error && (
                                    <div className="alert alert-danger py-2 px-3">
                                        {error}
                                    </div>
                                )}
                                <p className="text-muted mb-3">
                                    Enter your email address and we'll send you instructions to reset your password.
                                </p>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control bg-light py-2"
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="btn btn-primary w-100 py-2 mt-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader className="spinner-border spinner-border-sm me-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Reset Instructions"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal; 