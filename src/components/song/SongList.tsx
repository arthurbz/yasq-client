import { useContext, useEffect } from "react"
import { List, Row } from "antd"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "../../plugins/AxiosInstance"
import { AxiosError } from "axios"
import { socket } from "../../plugins/SocketInstance"
import { Song } from "../../types/Song"
import SongItem from "./SongItem"
import GlobalDataContext from "../../contexts/GlobalDataContext"

interface SongListProps {
    roomId?: string
}

function SongList({ roomId }: SongListProps) {
    const { song: currentSong } = useContext(GlobalDataContext)
    const queryClient = useQueryClient()

    useEffect(() => {
        socket.on("refreshSongs", () => {
            queryClient.invalidateQueries(["song", "find", "room", roomId])
        })

        return () => {
            socket.off("refreshSongs")
        }
    }, [])

    const { data: songs, isLoading } = useQuery<Song[], AxiosError<any, any>>({
        queryKey: ["song", "find", "room", roomId],
        enabled: !!roomId,
        staleTime: 1000 * 60 * 2,
        queryFn: async () => await axios.get(`/song/find/room/${roomId}`).then(response => response.data)
    })

    const renderItem = (song: Song) => {
        return (
            <Row style={{ display: "flex", justifyContent: "center", padding: 8, width: "100%" }}>
                <SongItem
                    key={song.id}
                    song={song}
                    isPlaying={currentSong?.id === song.id}
                />
            </Row>
        )
    }

    return (
        <List
            bordered
            loading={isLoading}
            locale={{ emptyText: "The playlist still empty." }}
            dataSource={songs}
            renderItem={renderItem}
            style={{ minHeight: "0px !important", height: "100% !important", overflowY: "scroll", width: "100%" }}
        />
    )
}

export default SongList
