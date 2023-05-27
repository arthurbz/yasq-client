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

export interface MusicHasEnded {
    user: User
    type: "musicHasEnded"
}

export interface ChangeSong {
    user: User
    goTo: "previous" | "next"
    type: "changeSong"
}

export type RoomAction = SongAdded | UserJoined | StateChanged | MusicHasEnded | ChangeSong
