/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from "react"
import { Song } from "../types/Song"

export interface GlobalPlayerContextParams {
    isPlaying: boolean,
    setIsPlaying: Dispatch<SetStateAction<boolean>>

    isReady: boolean,
    setIsReady: Dispatch<SetStateAction<boolean>>,

    song: Song | undefined,
    setSong: Dispatch<SetStateAction<Song | undefined>>
}

const GlobalPlayerContext = createContext<GlobalPlayerContextParams>({
    isPlaying: false,
    setIsPlaying: () => { },

    isReady: false,
    setIsReady: () => { },

    song: undefined,
    setSong: () => { }
})

export default GlobalPlayerContext
