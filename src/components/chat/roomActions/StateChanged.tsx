import { Avatar, Row, Card, Typography, Col } from "antd"
import { StateChanged } from "../../../types/RoomAction"

interface StateChangedProps {
    stateChanged: StateChanged
}

function StateChanged({ stateChanged }: StateChangedProps) {
    const { isPlaying, user } = stateChanged
    const avatarUrl = user ? `${import.meta.env.VITE_SERVER}${user.pfpPath}` : null

    return (
        <Card bodyStyle={{ padding: 8 }}>
            <Col>
                <Row style={{ gap: 4, alignItems: "center" }}>
                    <Avatar
                        size={"default"}
                        src={avatarUrl}
                    />
                    <Typography.Text ellipsis>
                        {user.name} <b>{isPlaying ? "started playing" : "has stopped"}</b> the music.
                    </Typography.Text>
                </Row>
            </Col>
        </Card>
    )
}

export default StateChanged
