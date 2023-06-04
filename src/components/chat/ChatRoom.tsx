import { Card, Col } from "antd"

// Components
import UserList from "../user/UserList"
import ChatHistory from "./ChatHistory"
import ChatInput from "./ChatInput"

interface ChatRoomProps {
    roomId?: string
}

function ChatRoom({ roomId }: ChatRoomProps) {
    return (
        <Card bodyStyle={{ backgroundColor: "#070707", borderRadius: 8 }}>
            <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                <UserList roomId={roomId} />
            </Col>

            <Col style={{ minHeight: 300 }}>
                <ChatHistory />
            </Col>

            <Col span={24}>
                <ChatInput />
            </Col>
        </Card>
    )
}

export default ChatRoom
