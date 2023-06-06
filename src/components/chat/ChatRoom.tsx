import { Col } from "antd"

// Components
import UserList from "../user/UserList"
import ChatHistory from "./ChatHistory"
import ChatInput from "./ChatInput"

interface ChatRoomProps {
    roomId?: string
}

function ChatRoom({ roomId }: ChatRoomProps) {
    return (
        <Col
            style={{
                border: "1px solid #494949",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#070707",
                borderRadius: 8,
                height: "100%",
                width: "100%",
                overflow: "auto"
            }}
        >
            <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
                <UserList roomId={roomId} />
            </div>

            <ChatHistory />

            <ChatInput />
        </Col>
    )
}

export default ChatRoom
