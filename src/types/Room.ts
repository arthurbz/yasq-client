import { User } from "./User"

interface Room {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    userId: string
    user?: User
}

export type { Room }
