import { useState, useEffect, useContext } from "react"
import { App, Button, Layout, Popconfirm, Row, Typography } from "antd"
const { Content, Footer } = Layout
import { useParams, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { axios } from "../plugins/AxiosInstance"
import { socket } from "../plugins/SocketInstance"

// Utils
import { getUserId, setUserId } from "../utils/StorageUtils"

// Components
import SearchBar from "../components/search/SearchBar"
import SongList from "../components/song/SongList"
import UserList from "../components/user/UserList"
import UserProfileCard from "../components/user/UserProfileCard"
import GlobalMusicPlayer from "../components/players/GlobalMusicPlayer"
import ChatInput from "../components/chat/ChatInput"
import ChatHistory from "../components/chat/ChatHistory"

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
import { LogoutOutlined } from "@ant-design/icons"

function Room() {
    const { room, setRoom, user, setUser, participation, setParticipation, setGlobalLoading } = useContext(GlobalDataContext)
    const { notification } = App.useApp()
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

    return (
        <Layout>
            <Content>
                <Row style={{ alignItems: "center" }}>
                    <Typography.Title ellipsis style={{ margin: 8 }}>
                        {room?.name}
                    </Typography.Title>

                    <Popconfirm
                        title="Are you sure you wanna leave this room?"
                        okText="Leave"
                        onConfirm={() => mutateLeaveRoom()}
                    >
                        <Button
                            type="default"
                            icon={<LogoutOutlined />}
                        />
                    </Popconfirm>

                    <SearchBar roomId={roomId} />

                    <UserProfileCard user={user} />
                </Row>

                <Row style={{ height: 500 }}>
                    <SongList roomId={roomId} />

                    <UserList roomId={roomId} />

                    <ChatHistory />
                    <ChatInput />
                </Row>
            </Content>

            <Footer style={{ padding: 0, position: "sticky", bottom: 0 }}>
                <GlobalMusicPlayer />
            </Footer>
        </Layout>
    )
}

export default Room
