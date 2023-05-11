/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from "react"
import { User } from "../types/User"
import { Room } from "../types/Room"

export interface GlobalDataContextParams {
    user: User | undefined,
    setUser: Dispatch<SetStateAction<User | undefined>>

    room: Room | undefined,
    setRoom: Dispatch<SetStateAction<Room | undefined>>
}

const GlobalDataContext = createContext<GlobalDataContextParams>({
    user: undefined,
    setUser: () => { },

    room: undefined,
    setRoom: () => { }
})

export default GlobalDataContext
