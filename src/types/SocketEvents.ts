import { Message, TextMessage } from "./Message.js"
import { RoomState } from "./Room.js"

export interface ServerToClientEvents {
    play: () => void
    pause: () => void
    textMessage: (message: Message<TextMessage>) => void
    currentState: (roomState: RoomState) => void
    refreshUsers: () => void
    refreshSongs: () => void
}

export interface ClientToServerEvents {
    joinRoom: (roomId: string) => void
    play: (roomId: string) => void
    pause: (roomId: string) => void
    sendMessage: (message: Message<TextMessage>) => void
    currentState: (roomId: string) => void
}
