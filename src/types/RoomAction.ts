import { Song } from "./Song.js"
import { User } from "./User.js"

export interface SongAdded {
    song: Song
    user: User
    type: "songAdded"
}

export interface UserJoined {
    user: User
    type: "userJoined"
}

export interface StateChanged {
    user: User
    isPlaying: boolean
    type: "stateChanged"
}

export type RoomAction = SongAdded | UserJoined | StateChanged
