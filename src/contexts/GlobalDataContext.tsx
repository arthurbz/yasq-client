/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from "react"
import { User } from "../types/User"
import { Room } from "../types/Room"

export interface GlobalDataContextParams {
    user: User | undefined,
    setUser: Dispatch<SetStateAction<User | undefined>>

    room: Room | undefined,
    setRoom: Dispatch<SetStateAction<Room | undefined>>

    globalLoading: boolean,
    setGlobalLoading: Dispatch<SetStateAction<boolean>>
}

const GlobalDataContext = createContext<GlobalDataContextParams>({
    user: undefined,
    setUser: () => { },

    room: undefined,
    setRoom: () => { },

    globalLoading: false,
    setGlobalLoading: () => { }
})

export default GlobalDataContext
