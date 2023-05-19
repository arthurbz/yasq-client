import { User } from "./User"

interface Message {
    user: User
    roomId: string
    content: string
    date: number
}

export type { Message }
