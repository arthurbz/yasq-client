import { Avatar, Row, Card, Typography, Col } from "antd"
import { SongAdded } from "../../../types/RoomAction"

interface SongAddedProps {
    songAdded: SongAdded
}

function SongAdded({ songAdded }: SongAddedProps) {
    const { song, user } = songAdded
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
                        {user.name} added the song <b>{song.name}</b>
                    </Typography.Paragraph>
                </Row>
            </Col>
        </Card>
    )
}

export default SongAdded
