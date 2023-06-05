import { useContext, useState } from "react"
import { App, Layout, Button, Image, Input, Row, Col, Typography, Space, Form } from "antd"
const { Title, Text, Paragraph } = Typography
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { axios } from "../plugins/AxiosInstance"
import YasqLogo from "../assets/images/yasq-logo.png"
import { AxiosError } from "axios"
import { ErrorResponseData } from "../types/ErrorResponseData"
import { getUserId, setUserId } from "../utils/StorageUtils"
import { CreateRoom, JoinWithUser, CreateOrJoinRoom } from "../types/CustomReactQueryTypes"
import GlobalDataContext from "../contexts/GlobalDataContext"

function Home() {
    const { setGlobalLoading } = useContext(GlobalDataContext)
    const { notification } = App.useApp()
    const navigate = useNavigate()
    const [createMode, setCreateMode] = useState(true)

    const onSuccess = (data: CreateOrJoinRoom) => {
        const { participationId, roomId, userId } = data

        if (!participationId || !roomId || !userId) {
            notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
            return
        }

        setGlobalLoading(true)
        setUserId(userId)
        navigate(`/room/${roomId}`)
    }

    const onError = () => {
        notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
    }

    const { mutate: mutateCreateWithRandomUser } = useMutation<CreateOrJoinRoom, AxiosError<ErrorResponseData, any>, string>({
        mutationKey: ["room", "create", "random"],
        mutationFn: async name => await axios.post("/room/create/random", { name }).then(response => response.data),
        onSuccess: onSuccess,
        onError: onError
    })

    const { mutate: mutateCreate } = useMutation<CreateOrJoinRoom, AxiosError<ErrorResponseData, any>, CreateRoom>({
        mutationKey: ["room", "create"],
        mutationFn: async createRoom => await axios.post("/room/create", createRoom).then(response => response.data),
        onSuccess: onSuccess,
        onError: onError
    })

    const { mutate: mutateJoinWithRandomUser } = useMutation<CreateOrJoinRoom, AxiosError<ErrorResponseData, any>, string>({
        mutationKey: ["participation", "join", "random"],
        mutationFn: async roomId => await axios.post("/participation/join/random", { roomId }).then(response => response.data),
        onSuccess: onSuccess,
        onError: onError
    })

    const { mutate: mutateJoin } = useMutation<CreateOrJoinRoom, AxiosError<ErrorResponseData, any>, JoinWithUser>({
        mutationKey: ["participation", "join"],
        mutationFn: async joinWithUser => await axios.post("/participation/join", joinWithUser).then(response => response.data),
        onSuccess: onSuccess,
        onError: onError
    })

    const submit = (formValues: { input?: string }) => {
        const { input } = formValues

        if (!input)
            return

        const storageUserId = getUserId()

        if (storageUserId) {
            createMode
                ? mutateCreate({ name: input, userId: storageUserId })
                : mutateJoin({ roomId: input, userId: storageUserId })
        } else {
            createMode
                ? mutateCreateWithRandomUser(input)
                : mutateJoinWithRandomUser(input)
        }
    }

    const switchInputMode = () => {
        setCreateMode(prevState => !prevState)
    }

    return (
        <Layout style={{ padding: 64 }}>
            <Row align="middle">
                <Col>
                    <Image
                        src={YasqLogo}
                        preview={false}
                        style={{ maxWidth: 128 }}
                    />
                </Col>
                <Col>
                    <Title style={{ margin: 0, marginLeft: 16, fontSize: "5.8em", fontWeight: 900 }}>
                        YASQ
                    </Title>
                </Col>
            </Row>

            <Col style={{ marginTop: 32 }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
                    Experience music with friends.
                </Title>

                <Paragraph style={{ fontSize: "1.5em" }}>
                    Listen to music with your friends. Interact with the music you are playing. Experience it.
                </Paragraph>
            </Col>

            <Col style={{ alignSelf: "center", rowGap: 0 }}>
                <Row>
                    <Text style={{ fontSize: "1.6em", marginLeft: 8, fontWeight: "bold" }}>
                        Listen together now
                    </Text>
                </Row>

                <Form onFinish={submit}>
                    <Space.Compact>
                        <Form.Item style={{ margin: 0 }} name="input">
                            <Input
                                placeholder={createMode ? "Name" : "Code"}
                                style={{ fontSize: "1.8em" }}
                            />
                        </Form.Item>

                        <Form.Item style={{ margin: 0 }}>
                            <Button
                                type="primary"
                                style={{ fontSize: "1.8em", height: "100%", fontWeight: "bold", minWidth: 110 }}
                                htmlType="submit"
                            >
                                {createMode ? "Create" : "Join"}
                            </Button>
                        </Form.Item>
                    </Space.Compact>

                    <Row>
                        <Button type="link" onClick={switchInputMode}>
                            {createMode ? "I want to join my friends instead" : "I want to create my own room"}
                        </Button>
                    </Row>
                </Form>
            </Col>
        </Layout>
    )
}

export default Home
