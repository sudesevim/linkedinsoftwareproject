import { useState } from "react";
import { X, Upload } from "lucide-react";

const ApplyJobModal = ({ isOpen, onClose, jobTitle, companyName }) => {
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setCvFile(file);
    } else {
      alert("Please upload a PDF or Word document");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      alert("Application submitted successfully!");
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.50)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
      }}>
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #e9ecef",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8f9fa"
        }}>
          <h5 style={{ margin: 0, fontWeight: "600" }}>Apply for {jobTitle}</h5>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "0",
              color: "#6c757d"
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: "20px" }}>
            <p style={{ color: "#6c757d", marginBottom: "24px" }}>
              You are applying for <span style={{ fontWeight: "600" }}>{jobTitle}</span> at <span style={{ fontWeight: "600" }}>{companyName}</span>
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                marginBottom: "8px",
                fontWeight: "600"
              }}>
                <Upload size={18} />
                Upload CV
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "2px solid #dee2e6",
                  borderRadius: "6px",
                  marginBottom: "4px"
                }}
              />
              <small style={{ color: "#6c757d" }}>
                Accepted formats: PDF, DOC, DOCX
              </small>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px",
                fontWeight: "600"
              }}>
                Cover Letter (Optional)
              </label>
              <textarea
                rows="4"
                placeholder="Tell us why you're interested in this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #dee2e6",
                  borderRadius: "6px",
                  resize: "vertical"
                }}
              />
            </div>
          </div>

          <div style={{
            paddingBottom: "20px",
            padding: "20px",
            borderTop: "1px solid #e9ecef",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            backgroundColor: "#f8f9fa"
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "8px 16px",
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                backgroundColor: "white",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!cvFile || isSubmitting}
              style={{
                padding: "8px 24px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#0d6efd",
                color: "white",
                cursor: "pointer",
                opacity: (!cvFile || isSubmitting) ? 0.8 : 1
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={{ marginRight: "8px" }}>⏳</span>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal; 