import { useState } from "react"
import { App, Layout, Button, Image, Input, Row, Col, Typography, Space, Form } from "antd"
const { Title, Text, Paragraph } = Typography
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { axios } from "../plugins/AxiosInstance"
import YasqLogo from "../assets/images/yasq-logo.svg"
import { AxiosError } from "axios"
import { ErrorResponseData } from "../types/ErrorResponseData"

function Home() {
    const { notification } = App.useApp()
    const navigate = useNavigate()
    const [createMode, setCreateMode] = useState(true)

    const { mutate: mutateCreate } = useMutation<{ roomId: string, userId: string }, AxiosError<ErrorResponseData, any>, string>({
        mutationKey: ["room", "create", "random"],
        mutationFn: async (name: string) => await axios.post("/room/create/random", { name }).then(response => response.data),
        onSuccess: (data) => {
            const { roomId, userId } = data

            if (!roomId || !userId) {
                notification.error({ message: "We are sorry, but there was an error when trying to create your room." })
                return
            }

            navigate(`/room/${roomId}`)
        },
        onError: () => {
            notification.error({ message: "We are sorry, but there was an error when trying to create your room." })
        }
    })

    // NOTE: The join method is not ready in the API, this is just a placeholder
    const { mutate: mutateJoin } = useMutation<{ roomId: string, userId: string }, AxiosError<ErrorResponseData, any>, string>({
        mutationKey: ["room", "join"],
        mutationFn: async (name: string) => await axios.post("/room/create/random", { name }).then(response => response.data),
        onSuccess: (data) => {
            const { roomId, userId } = data

            if (!roomId || !userId) {
                notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
                return
            }

            navigate(`/room/${roomId}`)
        },
        onError: () => {
            notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
        }
    })

    const submit = (formValues: { input?: string }) => {
        const { input } = formValues

        if (!input)
            return

        createMode ? mutateCreate(input) : mutateJoin(input)
    }

    const switchInputMode = () => {
        setCreateMode(prevState => !prevState)
    }

    return (
        <Layout style={{ margin: 16 }}>
            <Row style={{ alignItems: "center", gap: 8 }}>
                <Image
                    src={YasqLogo}
                    preview={false}
                    style={{ maxWidth: 82 }}
                />
                <Title style={{ margin: 0, fontSize: "4.42em" }}>
                    YASQ
                </Title>
            </Row>

            <Col>
                <Title level={2} style={{ margin: 0, fontWeight: 500 }}>
                    Experience more music with your friends.
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
                        <Form.Item style={{ margin: 0 }} name="roomName">
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
                        <Button type="text" onClick={switchInputMode}>
                            {createMode ? "I want to join my friends instead" : "I want to create my own room"}
                        </Button>
                    </Row>
                </Form>
            </Col>
        </Layout>
    )
}

export default Home
