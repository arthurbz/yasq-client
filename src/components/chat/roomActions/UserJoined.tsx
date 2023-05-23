import { Avatar, Row, Card, Typography, Col } from "antd"
import { UserJoined } from "../../../types/RoomAction"

interface UserJoinedProps {
    userJoined: UserJoined
}

function UserJoined({ userJoined }: UserJoinedProps) {
    const { user } = userJoined
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
                        {user.name} has joined the room.
                    </Typography.Text>
                </Row>
            </Col>
        </Card>
    )
}

export default UserJoined

