import { Layout, Button, Image, Input, Row, Col, Typography, Space, Form } from "antd"
const { Title, Text, Paragraph } = Typography
import YasqLogo from "../assets/images/yasq-logo.svg"
import { useMutation } from "@tanstack/react-query"
import { axios } from "../plugins/AxiosInstance"

function Home() {

    const { mutate } = useMutation({
        mutationKey: ["room", "create", "random"],
        mutationFn: async (name: string) => {
            return await axios.post("/room/create/random", { name }).then(response => response.data)
        },
        onSuccess: (data) => {
            // TODO - WIP
            console.log(data)
        }
    })

    const submit = (formValues: { roomName?: string }) => {
        const { roomName } = formValues

        if (roomName)
            mutate(roomName)
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

            <Col style={{ alignSelf: "center" }}>
                <Row>
                    <Text style={{ fontSize: "1.6em", marginLeft: 8, fontWeight: "bold" }}>
                        Listen together now
                    </Text>
                </Row>
                <Form onFinish={submit}>
                    <Space.Compact>
                        <Form.Item name="roomName">
                            <Input
                                placeholder="Room Name"
                                style={{ fontSize: "1.8em" }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                style={{ fontSize: "1.8em", height: "100%", fontWeight: "bold" }}
                                htmlType="submit"
                            >
                                Create
                            </Button>
                        </Form.Item>
                    </Space.Compact>
                </Form>
            </Col>
        </Layout>
    )
}

export default Home
