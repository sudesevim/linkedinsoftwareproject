import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  console.log("posts", posts);

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

          {posts?.length === 0 && (
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
