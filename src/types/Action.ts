import { User } from "./User.js"
import { RoomAction } from "./RoomAction.js"

export interface TextMessage {
    user: User
    text: string
    type: "textMessage"
}

export interface Action<Content extends TextMessage | RoomAction> {
    roomId: string
    content: Content
    date: number
}
