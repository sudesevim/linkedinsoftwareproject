import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { Briefcase } from "lucide-react";

const JobListingsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

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
              
              <div className="text-center py-5">
                <Briefcase size={48} className="text-secondary mb-3" />
                <h3 className="h5 fw-semibold mb-2">No Job Listings Yet</h3>
                <p className="text-muted">
                  Job listings will be displayed here soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingsPage; 