import { useQuery } from "@tanstack/react-query";

const RecommendendUser = ({user}) => {
    const queryClient = useQueryClient()

    const {data:connectionStatus, isLoading} = useQuery({
        queryKey: ["connectionStatus", user._id],
        queryFn: () => axiosInstance.get('/connections/status/${user._id}'),

    })

    const {mutate:sendConnectionRequest} = useMutation{
        mutationFn: (userId) => axiosInstence.post('/connections/request/${userId}'),
        onSuccess: () => {
            toast.success("Connection request sent successfully")
            queryClient.invalidateQueryies({queryKey: ["conenctionStatus", user._id]})
        }
    }
    return <div>RecommendedUser</div>;

};
export default RecommendedUser;