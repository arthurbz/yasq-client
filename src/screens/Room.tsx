import { useEffect, useContext } from "react"
import { App, Layout, Row, Typography } from "antd"
const { Content } = Layout
import { useParams, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { axios } from "../plugins/AxiosInstance"
import { socket } from "../plugins/SocketInstance"

// Components
import SearchBar from "../components/search/SearchBar"
import SongList from "../components/song/SongList"
import UserList from "../components/user/UserList"
import GlobalMusicPlayer from "../components/players/GlobalMusicPlayer"

// Types
import { Room } from "../types/Room"
import { ErrorResponseData } from "../types/ErrorResponseData"

// Contexts
import GlobalDataContext from "../contexts/GlobalDataContext"
import { getUserId, setUserId } from "../utils/StorageUtils"
import UserProfileCard from "../components/user/UserProfileCard"
import { JoinWithUser } from "../types/Mutations"

function Room() {
    const { notification } = App.useApp()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { room, setRoom } = useContext(GlobalDataContext)
    const { id: roomId } = useParams()

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Socket connected!", socket.id)
        })
    }, [])

    useEffect(() => {
        if (!room?.id)
            return

        socket.emit("joinRoom", roomId)

        const userId = getUserId()
        if (userId)
            mutateJoinWithUser({ userId, roomId: room.id })
        else
            mutateJoinWithRandomUser(room.id)
    }, [room])

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

    const { mutate: mutateJoinWithRandomUser } = useMutation<{ participationId: string, roomId: string, userId: string }, AxiosError<ErrorResponseData, any>, string>({
        mutationKey: ["participation", "join", "random"],
        mutationFn: async (roomId: string) => await axios.post("/participation/join/random", { roomId }).then(response => response.data),
        onSuccess: async (data) => {
            const { participationId, roomId, userId } = data

            if (!participationId || !roomId || !userId) {
                notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
                return
            }

            setUserId(userId)
            await queryClient.invalidateQueries(["participation", "find", "room", roomId])
        },
        onError: () => {
            notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
            navigate("/")
        }
    })

    const { mutate: mutateJoinWithUser } = useMutation<{ id: string }, AxiosError<ErrorResponseData, any>, JoinWithUser>({
        mutationKey: ["participation", "join"],
        mutationFn: async ({ roomId, userId }: JoinWithUser) => {
            const body = { userId, roomId }
            return await axios.post("/participation/join", body).then(response => response.data)
        },
        onSuccess: async (data) => {
            const { id } = data

            if (!id)
                notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
            await queryClient.invalidateQueries(["participation", "find", "room", roomId])
        },
        onError: () => {
            notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
            navigate("/")
        }
    })

    return (
        <Layout>
            <Content>
                <Row style={{ alignItems: "center" }}>
                    <Typography.Title ellipsis style={{ margin: 8 }}>
                        {room?.name}
                    </Typography.Title>

                    <SearchBar roomId={roomId} />

                    <UserProfileCard />
                </Row>

                <Row style={{ height: 500 }}>
                    <SongList roomId={roomId} />

                    <UserList roomId={roomId} />
                </Row>

                <Row style={{ padding: 8 }}>
                    <GlobalMusicPlayer />
                </Row>
            </Content>
        </Layout>
    )
}

export default Room
