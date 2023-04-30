import { Layout, Typography } from "antd"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { axios } from "../plugins/AxiosInstance"

import SearchBar from "../components/search/SearchBar"
import SongList from "../components/song/SongList"
import { Room } from "../types/Room"

function Room() {
    const { id: roomId } = useParams()

    const { data: room } = useQuery<Room, AxiosError<any, any>>({
        queryKey: ["room", "find", roomId],
        enabled: !!roomId && typeof roomId == "string",
        queryFn: async () => await axios.get(`/room/find/${roomId}`).then(response => response.data),
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
            <Typography.Title>
                {room?.name}
            </Typography.Title>

            <SearchBar />
            <SongList roomId={roomId} />
        </Layout>
    )
}

export default Room
