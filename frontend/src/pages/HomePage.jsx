import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import RecommendedUser from "../components/RecommendedUser";

const HomePage = () => {

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

  if (isLoadingPosts || isLoadingUsers) {
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
          <PostCreation user={authUser} />

          {posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}

          {(!posts || posts.length === 0) && (
            <div className="card text-center p-4">
              <div className="mb-3">
                <i className="bi bi-people-fill display-4 text-primary"></i>
              </div>
              <h2 className="h4 fw-bold mb-2 text-dark">No Posts Yet</h2>
              <p className="text-muted">
                Connect with others to start seeing posts in your feed!
              </p>
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
