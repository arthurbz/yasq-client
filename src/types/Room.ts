import { User } from "./User"
import { Song } from "./Song"

interface Room {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    userId: string
    user?: User
}

interface RoomState {
    isPlaying: boolean
    currentSong: Song | null
    songElapsedTime: number
}

export type { Room, RoomState }
