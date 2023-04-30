import { useQuery } from "@tanstack/react-query"
import { axios } from "../plugins/AxiosInstance"
import { AxiosError } from "axios"
import { Song } from "../types/Song"

interface SongListProps {
    roomId?: string
}

function SongList({ roomId }: SongListProps) {
    const { data: songs } = useQuery<Song[], AxiosError<any, any>>({
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

    return (
        <div>
            {songs?.map(song =>
                <div key={song.id}>
                    {song.name}
                </div>
            )}
        </div>
    )
}

export default SongList
