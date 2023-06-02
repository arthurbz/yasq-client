import { useEffect, useState } from "react"
import { Avatar, List, Modal, Row } from "antd"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { axios } from "../../plugins/AxiosInstance"
import { AxiosError } from "axios"
import { socket } from "../../plugins/SocketInstance"

import ThreeDotAvatar from "../templates/ThreeDotAvatar"
import { Participation } from "../../types/Participation"
import UserItem from "./UserItem"

interface UserListProps {
    roomId?: string
}

function UserList({ roomId }: UserListProps) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const baseUrl = import.meta.env.VITE_SERVER

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
                key={participation.id}
                user={participation.user}
                isOwner={participation.isOwner}
            />
        )
    }

    const usersElementOverlay = participations?.slice(0, 5).map((participation, index) => {
        const { user } = participation
        const avatarUrl = `${baseUrl}${user.pfpPath}`

        return (
            <Avatar
                key={participation.id}
                src={avatarUrl}
                style={{
                    width: 64,
                    height: 64,
                    position: "relative",
                    marginLeft: index > 0 ? -24 : 0
                }}
            />
        )
    })

    if (usersElementOverlay && participations && participations?.length > 5) {
        usersElementOverlay.push(<ThreeDotAvatar key="extra" />)
    }

    const openModal = () => setOpen(true)
    const closeModal = () => setOpen(false)

    return (
        <>
            <Row style={{ alignItems: "center", cursor: "pointer" }} onClick={openModal}>
                {usersElementOverlay}
            </Row>

            <Modal
                title="Users"
                style={{ textAlign: "center", fontWeight: "bolder" }}
                bodyStyle={{ maxHeight: 600 }}
                open={open}
                onCancel={closeModal}
                footer={null}
            >
                <List
                    loading={isLoading}
                    locale={{ emptyText: "Nobody joined the room yet." }}
                    dataSource={participations}
                    renderItem={renderItem}
                    style={{ height: "100%", maxHeight: 400, overflowY: "auto" }}
                />
            </Modal>
        </>
    )
}

export default UserList
