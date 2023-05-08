import { User } from "./User"

interface Participation {
    id: string
    isOwner: boolean
    user: User
    createdAt: Date
    updatedAt: Date
}

export type { Participation }
