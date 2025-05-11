import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import RecommendedUser from "../components/RecommendedUser";
import { Search, Filter, X, Users, FileText } from "lucide-react";
import { useState } from "react";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    type: "all",
    sortBy: "recent"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchType, setSearchType] = useState("posts"); // "posts" or "users"

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  
  const { data: recommendedUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/users/suggestions");
        return res.data;
      } catch (error) {
        console.error("Error fetching recommended users:", error);
        return [];
      }
    },
  });

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts");
        return res.data;
      } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
      }
    },
  });

  const { data: allUsers, isLoading: isLoadingAllUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/users");
        console.log("Fetched users:", res.data); // Debug log
        return res.data;
      } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
      }
    },
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      type: "all",
      sortBy: "recent"
    });
    setSearchQuery("");
  };

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedFilters.type === "all" || 
      (selectedFilters.type === "text" && !post.image) ||
      (selectedFilters.type === "image" && post.image);

    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (selectedFilters.sortBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (selectedFilters.sortBy === "likes") {
      return b.likes.length - a.likes.length;
    }
    return 0;
  });

  const filteredUsers = allUsers?.filter(user => {
    console.log("Filtering user:", user); // Debug log
    return searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  console.log("Filtered users:", filteredUsers); // Debug log

  if (isLoadingPosts || isLoadingUsers || isLoadingAllUsers) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {/* Sidebar */}
        <div className="d-none d-lg-block col-lg-3">
          <Sidebar user={authUser} />
        </div>

        <div className="col-12 col-lg-6 order-first order-lg-0">
          {/* Search and Filter Section */}
          <div className="card bg-light mb-4">
            <div className="card-body">
              <div className="d-flex gap-2 mb-3">
                <div className="flex-grow-1 position-relative">
                  <Search size={18} className="position-absolute top-50 start-3 translate-middle-y text-muted mx-2" />
                  <input
                    type="text"
                    className="form-control"
                    placeholder={searchType === "posts" ? "Search posts..." : "Search users..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: "2rem" }}
                  />
                </div>
                <div className="btn-group">
                  <button
                    className={`btn ${searchType === "posts" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setSearchType("posts")}
                  >
                    <FileText size={18} className="me-1" />
                    Posts
                  </button>
                  <button
                    className={`btn ${searchType === "users" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setSearchType("users")}
                  >
                    <Users size={18} className="me-1" />
                    Users
                  </button>
                </div>
                {searchType === "posts" && (
                  <button
                    className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter size={18} className="me-1" />
                    Filters
                  </button>
                )}
              </div>

              {showFilters && searchType === "posts" && (
                <div className="border-top pt-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small text-muted">Post Type</label>
                      <select
                        className="form-select"
                        value={selectedFilters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                      >
                        <option value="all">All Posts</option>
                        <option value="text">Text Only</option>
                        <option value="image">With Images</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted">Sort By</label>
                      <select
                        className="form-select"
                        value={selectedFilters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      >
                        <option value="recent">Most Recent</option>
                        <option value="likes">Most Liked</option>
                      </select>
                    </div>
                  </div>
                  {(searchQuery || selectedFilters.type !== "all" || selectedFilters.sortBy !== "recent") && (
                    <div className="mt-3 d-flex justify-content-end">
                      <button
                        className="btn btn-link text-decoration-none p-0"
                        onClick={clearFilters}
                      >
                        <X size={16} className="me-1" />
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {searchType === "posts" ? (
            <>
              <PostCreation user={authUser} />

              {filteredPosts?.map((post) => (
                <Post key={post._id} post={post} />
              ))}

              {(!filteredPosts || filteredPosts.length === 0) && (
                <div className="card text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-people-fill display-4 text-primary"></i>
                  </div>
                  <h2 className="h4 fw-bold mb-2 text-dark">No Posts Found</h2>
                  <p className="text-muted">
                    {searchQuery ? "Try adjusting your search or filters" : "Connect with others to start seeing posts in your feed!"}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="card">
              <div className="card-body">
                {searchQuery ? (
                  <>
                    {filteredUsers?.map((user) => (
                      <div key={user._id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                        <img
                          src={user.profilePicture || "https://via.placeholder.com/40"}
                          alt={user.name}
                          className="rounded-circle me-3"
                          style={{ width: "40px", height: "40px", objectFit: "cover" }}
                        />
                        <div>
                          <h6 className="mb-0">{user.name}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    ))}

                    {(!filteredUsers || filteredUsers.length === 0) && (
                      <div className="text-center p-4">
                        <div className="mb-3">
                          <i className="bi bi-search display-4 text-primary"></i>
                        </div>
                        <h2 className="h4 fw-bold mb-2 text-dark">No Users Found</h2>
                        <p className="text-muted">
                          Try adjusting your search
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="mb-3">
                      <i className="bi bi-search display-4 text-primary"></i>
                    </div>
                    <h2 className="h4 fw-bold mb-2 text-dark">Search Users</h2>
                    <p className="text-muted">
                      Enter a name or email to search for users
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {recommendedUsers?.length > 0 && (
          <div className="d-none d-lg-block col-lg-3">
            <div className="card bg-light p-3">
              <h5 className="fw-semibold mb-3">People you may know</h5>
              {recommendedUsers?.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
