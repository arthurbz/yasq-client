import { useState, useEffect, useContext } from "react"
import { LogoutOutlined, ShareAltOutlined } from "@ant-design/icons"
import { App, Button, Layout, Popconfirm, Row, Col, Image, Typography, Tooltip } from "antd"
const { Header, Content, Footer } = Layout
import { useParams, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { axios } from "../plugins/AxiosInstance"
import { socket } from "../plugins/SocketInstance"

import YasqLogo from "../assets/images/yasq-logo.png"

// Utils
import { getUserId, setUserId } from "../utils/StorageUtils"

// Components
import SearchBar from "../components/search/SearchBar"
import SongList from "../components/song/SongList"
import UserProfileCard from "../components/user/UserProfileCard"
import GlobalMusicPlayer from "../components/players/GlobalMusicPlayer"

// Types
import { Room } from "../types/Room"
import { User } from "../types/User"
import { Participation } from "../types/Participation"
import { ErrorResponseData } from "../types/ErrorResponseData"
import { CreateOrJoinRoom, JoinWithUser } from "../types/CustomReactQueryTypes"

// Contexts
import GlobalDataContext from "../contexts/GlobalDataContext"
import dayjs from "dayjs"
import { Action } from "../types/Action"
import { UserJoined } from "../types/RoomAction"
import ChatRoom from "../components/chat/ChatRoom"

function Room() {
    const { room, setRoom, user, setUser, participation, setParticipation, setGlobalLoading } = useContext(GlobalDataContext)
    const { notification, message } = App.useApp()
    const navigate = useNavigate()
    const { id: roomId } = useParams()
    const queryClient = useQueryClient()
    const userId = getUserId()
    const [participationId, setParticipationId] = useState<string | null>(null)

    useEffect(() => {
        setGlobalLoading(true)
        socket.on("connect", () => {
            console.log("Socket connected!", socket.id)
        })

        return () => {
            socket.off("connect")
            setGlobalLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!room)
            return

        if (userId)
            mutateJoinWithUser({ userId, roomId: room.id })
        else
            mutateJoinWithRandomUser(room.id)
    }, [room])

    useEffect(() => {
        // Once has User and Room join the socket room
        if (!room || !user)
            return

        const action: Action<UserJoined> = {
            roomId: room.id,
            content: {
                user: user,
                type: "userJoined"
            },
            date: dayjs().unix()
        }

        // Emit joinRoom and wait for server ACK to allow interactions with the page
        socket.emit("joinRoom", action, () => setGlobalLoading(false)).timeout(5000)
    }, [user])

    const onSuccess = (data: CreateOrJoinRoom) => {
        const { participationId, roomId, userId } = data

        if (!participationId || !roomId || !userId) {
            notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
            return
        }

        queryClient.invalidateQueries(["participation", "find", "room", roomId])
        setUserId(userId)
        setParticipationId(participationId)
    }

    const onError = () => {
        notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
    }

    useQuery<Room, AxiosError<ErrorResponseData, any>>({
        queryKey: ["room", "find", roomId],
        enabled: !!roomId && typeof roomId == "string",
        staleTime: 5 * 60 * 1000,
        retryDelay: 300,
        queryFn: async () => await axios.get(`/room/find/${roomId}`).then(response => response.data),
        onSuccess: room => setRoom(room),
        onError: data => {
            notification.error({ message: data.response?.data?.errorMessage })
            navigate("/")
        }
    })

    useQuery<User, AxiosError<ErrorResponseData, any>>({
        queryKey: ["user", "find", userId],
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        retryDelay: 300,
        queryFn: async () => await axios.get(`/user/find/${userId}`).then(response => response.data),
        onSuccess: user => setUser(user),
    })

    useQuery<Participation, AxiosError<ErrorResponseData, any>>({
        queryKey: ["participation", "find", participationId],
        enabled: !!participationId,
        staleTime: 15 * 60 * 1000,
        retryDelay: 1000,
        queryFn: async () => await axios.get(`/participation/find/${participationId}`).then(response => response.data),
        onSuccess: participation => setParticipation(participation),
    })

    const { mutate: mutateJoinWithRandomUser } = useMutation<CreateOrJoinRoom, AxiosError<ErrorResponseData, any>, string>({
        mutationKey: ["participation", "join", "random"],
        mutationFn: async roomId => await axios.post("/participation/join/random", { roomId }).then(response => response.data),
        onSuccess: onSuccess,
        onError: onError
    })

    const { mutate: mutateJoinWithUser } = useMutation<CreateOrJoinRoom, AxiosError<ErrorResponseData, any>, JoinWithUser>({
        mutationKey: ["participation", "join"],
        mutationFn: async joinWithUser => await axios.post("/participation/join", joinWithUser).then(response => response.data),
        onSuccess: onSuccess,
        onError: onError
    })

    const { mutate: mutateLeaveRoom } = useMutation<unknown, AxiosError<ErrorResponseData, any>>({
        mutationKey: ["participation", "leave"],
        mutationFn: async () => {
            console.log(participation)
            if (!participation) return
            await axios.delete(`/participation/leave/${participation?.id}`)
                .then(response => response.data)
        },
        onSuccess: () => {
            navigate("/")
            socket.disconnect()
            queryClient.clear()
        }
    })

    const shareRoom = () => {
        navigator.clipboard.writeText(window.location.href)
        message.success("Link copied to clipboard!")
    }

    return (
        <Layout style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header style={{ background: "#070707", padding: 32, height: "auto" }}>
                <Row
                    align="middle"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <Col
                        xs={{ span: 6, order: 1 }}
                        sm={{ span: 15, order: 1 }}
                        md={{ span: 6, order: 1 }}
                        lg={{ span: 6, order: 1 }}
                    >
                        <Row justify="start" align="middle">
                            <Col xs={24} sm={4} md={6} lg={6} xl={6} xxl={4}>
                                <Image
                                    src={YasqLogo}
                                    preview={false}
                                    style={{ minWidth: 42, maxWidth: 64 }}
                                />
                            </Col>

                            <Col xs={0} sm={20} md={18} lg={18} xl={18} xxl={20} style={{ textAlign: "start" }}>
                                <Typography.Title ellipsis style={{ margin: 0 }}>
                                    {room?.name}
                                </Typography.Title>
                            </Col>
                        </Row>
                    </Col>

                    <Col
                        xs={{ span: 24, order: 3 }}
                        sm={{ span: 24, order: 3 }}
                        md={{ span: 12, order: 2 }}
                        lg={{ span: 12, order: 2 }}
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <SearchBar roomId={roomId} />
                    </Col>

                    <Col
                        xs={{ span: 18, order: 2 }}
                        sm={{ span: 9, order: 2 }}
                        md={{ span: 6, order: 3 }}
                        lg={{ span: 6, order: 3 }}
                        xl={{ span: 3, order: 3, offset: 3 }}
                        xxl={{ span: 3, order: 3, offset: 3 }}
                    >
                        <Row align="middle" justify="end">
                            <Col span={8}>
                                <UserProfileCard user={user} />
                            </Col>

                            <Col span={8} style={{ textAlign: "center" }}>
                                <Tooltip title="Share this room." mouseEnterDelay={1}>
                                    <Button
                                        type="link"
                                        size="large"
                                        style={{ fontSize: "1.4em", alignItems: "center" }}
                                        icon={<ShareAltOutlined />}
                                        onClick={shareRoom}
                                    />
                                </Tooltip>
                            </Col>

                            <Col span={8} style={{ textAlign: "center" }}>
                                <Popconfirm
                                    title="Are you sure you wanna leave this room?"
                                    okText="Leave"
                                    onConfirm={() => mutateLeaveRoom()}
                                >
                                    <Button
                                        type="link"
                                        size="large"
                                        style={{ fontSize: "1.4em", alignItems: "center" }}
                                        icon={<LogoutOutlined />}
                                    />
                                </Popconfirm>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Header>

            <Content style={{ overflowX: "hidden", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                <Row
                    gutter={{ xs: 0, sm: 32 }}
                    style={{ padding: "0px 32px", height: "100%", width: "100%" }}
                >
                    <Col
                        xs={{ span: 24, order: 2 }}
                        sm={{ span: 24, order: 2 }}
                        md={{ span: 12, order: 1 }}
                        lg={{ span: 8, order: 1 }}
                        xl={{ span: 6, order: 1 }}
                        xxl={{ span: 6, order: 1 }}
                        style={{ height: "100%" }}
                    >
                        <SongList roomId={roomId} />
                    </Col>

                    <Col
                        xs={{ span: 24, order: 1 }}
                        sm={{ span: 24, order: 1 }}
                        md={{ span: 12, order: 2 }}
                        lg={{ span: 16, order: 2 }}
                        xl={{ span: 12, order: 2 }}
                        xxl={{ span: 12, order: 2 }}
                        style={{ height: "100%" }}
                    >
                        <ChatRoom roomId={roomId} />
                    </Col>
                </Row>
            </Content>

            <Footer style={{ padding: 32, margin: 0 }}>
                <GlobalMusicPlayer />
            </Footer>
        </Layout>
    )
}

export default Room
