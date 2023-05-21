/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from "react"
import { Song } from "../types/Song"
import { Volume } from "../types/Volume"

export interface GlobalPlayerContextParams {
    isPlaying: boolean
    setIsPlaying: Dispatch<SetStateAction<boolean>>

    isReady: boolean
    setIsReady: Dispatch<SetStateAction<boolean>>

    song: Song | undefined
    setSong: Dispatch<SetStateAction<Song | undefined>>

    volume: Volume
    setVolume: Dispatch<SetStateAction<Volume>>

    elapsedTime: number
    setElapsedTime: Dispatch<SetStateAction<number>>
}

const GlobalPlayerContext = createContext<GlobalPlayerContextParams>({
    isPlaying: false,
    setIsPlaying: () => { },

    isReady: false,
    setIsReady: () => { },

    song: undefined,
    setSong: () => { },

    volume: { value: 0, isMuted: false },
    setVolume: () => { },

    elapsedTime: 0,
    setElapsedTime: () => { }
})

export default GlobalPlayerContext
