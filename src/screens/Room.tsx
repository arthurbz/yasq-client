import { Layout, Typography } from "antd"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { axios } from "../plugins/AxiosInstance"
import SearchBar from "../components/search/SearchBar"

function Room() {
    const { id } = useParams()
    useQuery({
        queryKey: ["room", "find", id],
        enabled: !!id && typeof id == "string",
        queryFn: async () => await axios.get(`/room/find/${id}`,).then(response => response.data),
        onSuccess: (data) => {
            // TODO - WIP
            console.log(data)
        },
        onError: (data) => {
            // TODO - Redirect to main page and show a notification
            console.log("Error", data)
        }
    })

    return (
        <Layout>
            <Typography>
                Room
                <SearchBar />
            </Typography>
        </Layout>
    )
}

export default Room
