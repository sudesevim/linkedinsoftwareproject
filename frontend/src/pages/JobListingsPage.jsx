import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { Briefcase, MapPin, Clock, DollarSign, Building, Check, Bookmark, Trash2, AlertCircle } from "lucide-react";
import { mockJobs } from "../data/mockJobs";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ApplyJobModal from "../components/ApplyJobModal";

const JobListingsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [withdrawJobId, setWithdrawJobId] = useState(null);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleApplicationSubmit = (jobId) => {
    setAppliedJobs(prev => new Set([...prev, jobId]));
  };

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleWithdrawClick = (jobId) => {
    setWithdrawJobId(jobId);
  };

  const handleWithdrawConfirm = () => {
    setAppliedJobs(prev => {
      const newSet = new Set(prev);
      newSet.delete(withdrawJobId);
      return newSet;
    });
    setWithdrawJobId(null);
  };

  const handleWithdrawCancel = () => {
    setWithdrawJobId(null);
  };

  const savedJobsList = mockJobs.filter(job => savedJobs.has(job.id));
  const appliedJobsList = mockJobs.filter(job => appliedJobs.has(job.id));
  const jobToWithdraw = withdrawJobId ? mockJobs.find(job => job.id === withdrawJobId) : null;

  return (
    <div className="container mt-4">
      <div className="row g-4">
        <div className="col-lg-3">
          <Sidebar user={authUser} />
          
          {savedJobs.size > 0 && (
            <div className="card bg-light shadow-sm mb-4 mt-4">
              <div className="card-body">
                <h5 className="card-title h6 mb-3 d-flex align-items-center gap-2">
                  <Bookmark size={18} className="text-success" />
                  Saved Jobs
                </h5>
                <div className="d-flex flex-column gap-2">
                  {savedJobsList.map(job => (
                    <div key={job.id} className="card bg-white">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-1 small">{job.title}</h6>
                          <button
                            onClick={() => handleSaveJob(job.id)}
                            className="btn btn-link p-0 text-decoration-none"
                            style={{ color: '#dc3545' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-muted small mb-2">{job.company}</p>
                        <div className="d-flex align-items-center text-muted small">
                          <MapPin size={14} className="me-1" />
                          {job.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {appliedJobs.size > 0 && (
            <div className="card bg-light shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title h6 mb-3 d-flex align-items-center gap-2">
                  <Check size={18} className="text-success" />
                  Applied Jobs
                </h5>
                <div className="d-flex flex-column gap-2">
                  {appliedJobsList.map(job => (
                    <div key={job.id} className="card bg-white">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-1 small">{job.title}</h6>
                          <button
                            onClick={() => handleWithdrawClick(job.id)}
                            className="btn btn-link p-0 text-decoration-none"
                            style={{ color: '#dc3545' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-muted small mb-2">{job.company}</p>
                        <div className="d-flex align-items-center text-muted small">
                          <MapPin size={14} className="me-1" />
                          {job.location}
                        </div>
                        <div className="d-flex align-items-center text-success small mt-2">
                          <Check size={14} className="me-1" />
                          Application Submitted
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-lg-9">
          <div className="card bg-light shadow-sm mb-4">
            <div className="card-body">
              <h1 className="h4 mb-4 fw-bold">Jobs</h1>
              
              <div className="d-flex flex-column gap-3">
                {mockJobs.map((job) => (
                  <div key={job.id} className="card bg-white">
                    <div className="card-body">
                      <div className="d-flex gap-3">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="rounded"
                          style={{ width: "64px", height: "64px", objectFit: "cover" }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-1">{job.title}</h5>
                            <button
                              onClick={() => handleSaveJob(job.id)}
                              className="btn btn-link p-0 text-decoration-none"
                              style={{ color: savedJobs.has(job.id) ? '#198754' : '#6c757d' }}
                            >
                              <Bookmark size={20} fill={savedJobs.has(job.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                          <p className="text-muted mb-2">{job.company}</p>
                          
                          <div className="d-flex flex-wrap gap-3 mb-3">
                            <div className="d-flex align-items-center text-muted small">
                              <MapPin size={16} className="me-1" />
                              {job.location}
                            </div>
                            <div className="d-flex align-items-center text-muted small">
                              <Clock size={16} className="me-1" />
                              {job.type}
                            </div>
                            <div className="d-flex align-items-center text-muted small">
                              <DollarSign size={16} className="me-1" />
                              {job.salary}
                            </div>
                          </div>

                          <p className="card-text mb-3">{job.description}</p>

                          <div className="mb-3">
                            <h6 className="fw-semibold mb-2">Requirements:</h6>
                            <ul className="list-unstyled mb-0">
                              {job.requirements.map((req, index) => (
                                <li key={index} className="text-muted small mb-1">
                                  • {req}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                            </small>
                            <button 
                              className={`btn btn-sm d-flex align-items-center gap-1 ${appliedJobs.has(job.id) ? 'btn-success' : 'btn-primary'}`}
                              onClick={() => appliedJobs.has(job.id) ? handleWithdrawClick(job.id) : handleApplyClick(job)}
                            >
                              {appliedJobs.has(job.id) ? (
                                <>
                                  <Check size={16} />
                                  Applied
                                </>
                              ) : (
                                'Apply Now'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedJob && (
        <ApplyJobModal
          isOpen={!!selectedJob}
          onClose={handleCloseModal}
          jobTitle={selectedJob.title}
          companyName={selectedJob.company}
          onApplicationSubmit={() => handleApplicationSubmit(selectedJob.id)}
        />
      )}

      {/* Withdraw Confirmation Modal */}
      {withdrawJobId && jobToWithdraw && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Withdraw Application</h5>
                <button type="button" className="btn-close" onClick={handleWithdrawCancel}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <AlertCircle size={24} className="text-warning" />
                  <p className="mb-0">
                    Are you sure you want to withdraw your application for <strong>{jobToWithdraw.title}</strong> at <strong>{jobToWithdraw.company}</strong>?
                  </p>
                </div>
                <p className="text-muted small mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleWithdrawCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleWithdrawConfirm}>
                  Withdraw Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListingsPage; 