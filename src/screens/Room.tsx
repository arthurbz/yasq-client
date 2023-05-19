import { useEffect, useContext } from "react"
import { App, Layout, Row, Typography } from "antd"
const { Content } = Layout
import { useParams, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
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
import { ErrorResponseData } from "../types/ErrorResponseData"
import { CreateOrJoinRoom, JoinWithUser } from "../types/CustomReactQueryTypes"

// Contexts
import GlobalDataContext from "../contexts/GlobalDataContext"

function Room() {
    const { notification } = App.useApp()
    const navigate = useNavigate()
    const { room, setRoom, user, setUser } = useContext(GlobalDataContext)
    const { id: roomId } = useParams()
    const userId = getUserId()

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Socket connected!", socket.id)
        })

        return () => {
            socket.off("connect")
        }
    }, [])

    useEffect(() => {
        if (!room?.id)
            return

        socket.emit("joinRoom", roomId)

        if (userId)
            mutateJoinWithUser({ userId, roomId: room.id })
        else
            mutateJoinWithRandomUser(room.id)
    }, [room])

    const onSuccess = (data: CreateOrJoinRoom) => {
        const { participationId, roomId, userId } = data

        if (!participationId || !roomId || !userId) {
            notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
            return
        }

        setUserId(userId)
        navigate(`/room/${roomId}`)
    }

    const onError = () => {
        notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
    }

    useQuery<Room, AxiosError<ErrorResponseData, any>>({
        queryKey: ["room", "find", roomId],
        enabled: !!roomId && typeof roomId == "string",
        staleTime: 5 * 60 * 1000,
        retryDelay: 250,
        queryFn: async () => await axios.get(`/room/find/${roomId}`).then(response => response.data),
        onSuccess: room => setRoom(room),
        onError: data => {
            notification.error({ message: data.response?.data?.errorMessage })
            navigate("/")
        }
    })

    useQuery<User, AxiosError<ErrorResponseData, any>>({
        queryKey: ["room", "find", userId],
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        retryDelay: 250,
        queryFn: async () => await axios.get(`/user/find/${userId}`).then(response => response.data),
        onSuccess: user => setUser(user),
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

    return (
        <Layout>
            <Content>
                <Row style={{ alignItems: "center" }}>
                    <Typography.Title ellipsis style={{ margin: 8 }}>
                        {room?.name}
                    </Typography.Title>

                    <SearchBar roomId={roomId} />

                    <UserProfileCard user={user} />
                </Row>

                <Row style={{ height: 500 }}>
                    <SongList roomId={roomId} />

                    <UserList roomId={roomId} />

                    <ChatHistory />
                    <ChatInput />
                </Row>

                <Row style={{ padding: 8 }}>
                    <GlobalMusicPlayer />
                </Row>
            </Content>
        </Layout>
    )
}

export default Room
