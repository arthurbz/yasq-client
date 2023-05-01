import { Layout, Row, Typography } from "antd"
const { Content } = Layout
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { axios } from "../plugins/AxiosInstance"

import SearchBar from "../components/search/SearchBar"
import SongList from "../components/song/SongList"
import { Room } from "../types/Room"
import GlobalMusicPlayer from "../components/players/GlobalMusicPlayer"

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
            <Content>
                <Row style={{ alignItems: "center" }}>
                    <Typography.Title ellipsis style={{ margin: 8 }}>
                        {room?.name}
                    </Typography.Title>

                    <SearchBar />
                </Row>

                <Row style={{ height: 500 }}>
                    <SongList roomId={roomId} />
                </Row>

                <Row style={{ padding: 8 }}>
                    <GlobalMusicPlayer />
                </Row>
            </Content>
        </Layout>
    )
}

export default Room
