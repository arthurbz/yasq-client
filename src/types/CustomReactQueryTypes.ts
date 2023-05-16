export interface JoinWithUser {
    userId: string
    roomId: string
}

export interface CreateRoom {
    name: string
    userId: string
}

export interface CreateOrJoinRoom {
    roomId: string
    userId: string
    participationId: string
}
