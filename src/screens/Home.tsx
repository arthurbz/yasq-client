import { Layout, Button, Image, Input, Row, Col, Typography, Space } from "antd"
const { Title, Text, Paragraph } = Typography
import YasqLogo from "../assets/yasq-logo.svg"

function Home() {
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

                <Space.Compact>
                    <Input
                        placeholder="Room Name"
                        style={{ fontSize: "1.8em" }}
                    />
                    <Button
                        type="primary"
                        style={{ fontSize: "1.8em", height: "100%", fontWeight: "bold" }}
                    >
                        Create
                    </Button>
                </Space.Compact>
            </Col>
        </Layout>
    )
}

export default Home
