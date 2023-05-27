import { useEffect } from "react"
import { List } from "antd"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "../../plugins/AxiosInstance"
import { AxiosError } from "axios"
import { socket } from "../../plugins/SocketInstance"
import { Song } from "../../types/Song"
import SongItem from "./SongItem"

interface SongListProps {
    roomId?: string
}

function SongList({ roomId }: SongListProps) {
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
        queryFn: async () => await axios.get(`/song/find/room/${roomId}`,).then(response => response.data)
    })

    const renderItem = (song: Song) => {
        return (
            <SongItem
                key={song.id}
                song={song}
            />
        )
    }

    return (
        <List
            bordered
            loading={isLoading}
            dataSource={songs}
            renderItem={renderItem}
            style={{ height: "100%", overflowY: "auto" }}
        />
    )
}

export default SongList
