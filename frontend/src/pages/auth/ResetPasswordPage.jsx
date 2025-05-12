import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { Loader } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post('/auth/reset-password', {
        token,
        password
      });
      
      toast.success('Password has been reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center py-5 px-3 bg-light">
      <div className="mx-auto w-100" style={{ maxWidth: "400px" }}>
        <div className="text-center mb-4">
          <img src="/logo.svg" alt="LinkedIn" style={{ height: "160px" }} className="mx-auto d-block" />
          <h2 className="h4 fw-bold text-dark mt-3">Reset Your Password</h2>
          <p className="text-muted">Please enter your new password</p>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div>
                <label htmlFor="password" className="form-label">New Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-control bg-light"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="form-control bg-light"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100"
              >
                {loading ? (
                  <>
                    <Loader className="spinner-border spinner-border-sm me-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 