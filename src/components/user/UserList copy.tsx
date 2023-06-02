import { useEffect } from "react"
import { List } from "antd"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "../../plugins/AxiosInstance"
import { AxiosError } from "axios"
import { socket } from "../../plugins/SocketInstance"

import { Participation } from "../../types/Participation"
import UserItem from "./UserItem"

interface UserListProps {
    roomId?: string
}

function UserList({ roomId }: UserListProps) {
    const queryClient = useQueryClient()

    useEffect(() => {
        socket.on("refreshUsers", () => {
            queryClient.invalidateQueries(["participation", "find", "room", roomId])
        })

        return () => {
            socket.off("refreshUsers")
        }
    }, [])

    const { data: participations, isLoading } = useQuery<Participation[], AxiosError<any, any>>({
        queryKey: ["participation", "find", "room", roomId],
        enabled: !!roomId,
        staleTime: 1000 * 60 * 2,
        queryFn: async () => await axios.get(`/participation/find/room/${roomId}`,).then(response => response.data)
    })

    const renderItem = (participation: Participation) => {
        return (
            <UserItem
                key={participation.user.id}
                user={participation.user}
                isOwner={participation.isOwner}
            />
        )
    }

    return (
        <List
            bordered
            loading={isLoading}
            locale={{ emptyText: "Nobody joined the room yet." }}
            dataSource={participations}
            renderItem={renderItem}
            style={{ height: "100%", overflowY: "auto" }}
        />
    )
}

export default UserList
