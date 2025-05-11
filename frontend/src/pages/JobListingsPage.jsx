import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { Briefcase, MapPin, Clock, DollarSign, Building } from "lucide-react";
import { mockJobs } from "../data/mockJobs";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ApplyJobModal from "../components/ApplyJobModal";

const JobListingsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [selectedJob, setSelectedJob] = useState(null);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="container mt-4">
      <div className="row g-4">
        <div className="col-lg-3">
          <Sidebar user={authUser} />
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
                          <h5 className="card-title mb-1">{job.title}</h5>
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
                              className="btn btn-primary btn-sm"
                              onClick={() => handleApplyClick(job)}
                            >
                              Apply Now
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
        />
      )}
    </div>
  );
};

export default JobListingsPage; 