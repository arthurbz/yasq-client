import { User } from "./User"

interface Message {
    user: User
    roomId: string
    message: string
    date: Date
}

export type { Message }
