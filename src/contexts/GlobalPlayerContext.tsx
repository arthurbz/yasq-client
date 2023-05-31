/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from "react"
import { Volume } from "../types/Volume"

export interface GlobalPlayerContextParams {
    isPlaying: boolean
    setIsPlaying: Dispatch<SetStateAction<boolean>>

    isReady: boolean
    setIsReady: Dispatch<SetStateAction<boolean>>

    volume: Volume
    setVolume: Dispatch<SetStateAction<Volume>>

    elapsedTime: number
    setElapsedTime: Dispatch<SetStateAction<number>>

    songHasEnded: boolean
    setSongHasEnded: Dispatch<SetStateAction<boolean>>
}

const GlobalPlayerContext = createContext<GlobalPlayerContextParams>({
    isPlaying: false,
    setIsPlaying: () => { },

    isReady: false,
    setIsReady: () => { },

    volume: { value: 0, isMuted: false },
    setVolume: () => { },

    elapsedTime: 0,
    setElapsedTime: () => { },

    songHasEnded: false,
    setSongHasEnded: () => { },
})

export default GlobalPlayerContext
