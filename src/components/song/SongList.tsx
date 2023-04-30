import { useQuery } from "@tanstack/react-query"
import { axios } from "../../plugins/AxiosInstance"
import { AxiosError } from "axios"
import { Song } from "../../types/Song"
import SongItem from "./SongItem"
import { Card, List, Row } from "antd"

interface SongListProps {
    roomId?: string
}

function SongList({ roomId }: SongListProps) {
    const { data: songs, isLoading } = useQuery<Song[], AxiosError<any, any>>({
        queryKey: ["song", "find", "room", roomId],
        enabled: !!roomId,
        queryFn: async () => await axios.get(`/song/find/room/${roomId}`,).then(response => response.data),
        onSuccess: (data) => {
            console.log(data)
        },
        onError: (data) => {
            console.log("Error", data)
        }
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
