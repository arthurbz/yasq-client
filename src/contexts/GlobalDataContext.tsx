/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from "react"
import { User } from "../types/User"
import { Room } from "../types/Room"
import { Song } from "../types/Song"
import { Participation } from "../types/Participation"

export interface GlobalDataContextParams {
    user: User | undefined,
    setUser: Dispatch<SetStateAction<User | undefined>>

    room: Room | undefined,
    setRoom: Dispatch<SetStateAction<Room | undefined>>

    participation: Participation | undefined,
    setParticipation: Dispatch<SetStateAction<Participation | undefined>>

    song: Song | undefined
    setSong: Dispatch<SetStateAction<Song | undefined>>

    globalLoading: boolean,
    setGlobalLoading: Dispatch<SetStateAction<boolean>>
}

const GlobalDataContext = createContext<GlobalDataContextParams>({
    user: undefined,
    setUser: () => { },

    room: undefined,
    setRoom: () => { },

    participation: undefined,
    setParticipation: () => { },

    song: undefined,
    setSong: () => { },

    globalLoading: false,
    setGlobalLoading: () => { }
})

export default GlobalDataContext
