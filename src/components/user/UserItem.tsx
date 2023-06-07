import { useContext, useState } from "react"
import { DeleteOutlined } from "@ant-design/icons"
import { Avatar, Row, Col, Button, Typography, App } from "antd"
import { CrownOutlined } from "@ant-design/icons"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { ErrorResponseData } from "../../types/ErrorResponseData"
import { axios } from "../../plugins/AxiosInstance"
import { User } from "../../types/User"
import { Participation } from "../../types/Participation"
import GlobalDataContext from "../../contexts/GlobalDataContext"

interface UserItemProps {
    user: User
    participation: Participation
}

function UserItem({ user, participation }: UserItemProps) {
    const { room, participation: myParticipation } = useContext(GlobalDataContext)
    const { notification } = App.useApp()
    const queryClient = useQueryClient()
    const { name, pfpPath } = user
    const avatarUrl = `${import.meta.env.VITE_SERVER}${pfpPath}`
    const [hovering, setHovering] = useState(false)

    const { mutate: mutateRemoveUser } = useMutation<unknown, AxiosError<ErrorResponseData, any>>({
        mutationKey: ["participation", "leave", participation.id],
        mutationFn: async () => await axios.delete(`/participation/leave/${participation.id}`).then(response => response.data),
        onSuccess: () => {
            queryClient.invalidateQueries(["participation", "find", "room", room?.id])
            queryClient.setQueryData(
                ["participation", "find", "room", room?.id],
                (oldData: Participation[] | undefined) => {
                    return oldData?.filter(p => p.id != participation.id)
                }
            )
        },
        onError: () => {
            notification.error({ message: "We are sorry, there was an error removing this user." })
        }
    })

    return (
        <Row
            wrap={false}
            gutter={16}
            style={{
                padding: "8px 16px 8px 16px",
                width: "100%",
                alignItems: "center"
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <Row align="middle">
                {participation.isOwner ? <CrownOutlined style={{ fontSize: 24, marginRight: 4 }} /> : null}

                <Avatar
                    shape="circle"
                    alt={`Avatar picture for ${name}`}
                    src={avatarUrl}
                    size={"large"}
                />

                <Typography.Title ellipsis level={5} style={{ margin: 0 }}>
                    {name}
                </Typography.Title>
            </Row>

            {hovering
                && !participation.isOwner
                && myParticipation?.isOwner
                && participation.id != myParticipation?.id
                ?
                <Col
                    flex="auto"
                    className={hovering ? "hover-item-fade-in" : ""}
                    style={{ display: "flex", justifyContent: "end" }}
                >
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => mutateRemoveUser()}
                    />
                </Col>
                : null
            }
        </Row>
    )
}

export default UserItem
