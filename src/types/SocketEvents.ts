import { Action, TextMessage } from "./Action.js"
import { RoomState } from "./Room.js"
import { SongAdded, StateChanged, UserJoined } from "./RoomAction.js"

export interface ServerToClientEvents {
    play: () => void
    pause: () => void
    currentState: (roomState: RoomState) => void
    refreshUsers: () => void
    refreshSongs: () => void
    textMessage: (action: Action<TextMessage>) => void
    songAdded: (action: Action<SongAdded>) => void
    userJoined: (action: Action<UserJoined>) => void
    stateChanged: (action: Action<StateChanged>) => void
}

export interface ClientToServerEvents {
    joinRoom: (action: Action<UserJoined>, callback: () => void) => void
    play: (action: Action<StateChanged>) => void
    pause: (action: Action<StateChanged>) => void
    currentState: (roomId: string) => void
    sendMessage: (message: Action<TextMessage>) => void
}
