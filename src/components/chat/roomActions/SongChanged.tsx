import { Avatar, Row, Card, Typography, Col } from "antd"
import { ChangeSong } from "../../../types/RoomAction"

interface ChangeSongProps {
    changeSong: ChangeSong
}

function ChangeSong({ changeSong }: ChangeSongProps) {
    const { user, goTo } = changeSong
    const avatarUrl = user ? `${import.meta.env.VITE_SERVER}${user.pfpPath}` : null

    return (
        <Card bodyStyle={{ padding: 8 }}>
            <Col>
                <Row style={{ gap: 4, alignItems: "center" }}>
                    <Avatar
                        size={"default"}
                        src={avatarUrl}
                    />

                    <Typography.Paragraph
                        style={{
                            margin: 0,
                            maxHeight: 128,
                            maxWidth: 300,
                            textAlign: "justify",
                            textJustify: "inter-word",
                            overflowY: "hidden"
                        }}
                    >
                        {user.name} changed to the <b>{goTo} song!</b>
                    </Typography.Paragraph>
                </Row>
            </Col>
        </Card>
    )
}

export default ChangeSong
