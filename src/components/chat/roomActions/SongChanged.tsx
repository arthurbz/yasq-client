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
                    <Typography.Text ellipsis>
                        {user.name} changed to the <b>{goTo} song!</b>
                    </Typography.Text>
                </Row>
            </Col>
        </Card>
    )
}

export default ChangeSong
