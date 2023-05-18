import { useContext } from "react"
import { Space, Input, Button, Form } from "antd"
import { SendOutlined } from "@ant-design/icons"
import { socket } from "../../plugins/SocketInstance"
import GlobalDataContext from "../../contexts/GlobalDataContext"
import { Message } from "../../types/Message"

const MAX_MESSAGE_LENGTH = 500

function ChatInput() {
    const { room, user } = useContext(GlobalDataContext)

    const sendMessage = (form: { text: string }) => {
        const { text } = form

        if (!user || !room || !text || text.length > MAX_MESSAGE_LENGTH)
            return

        const message: Message = {
            user: user,
            roomId: room.id,
            message: text,
            date: new Date()
        }

        socket.emit("sendMessage", message)
    }

    return (
        <Form onFinish={sendMessage}>
            <Space>
                <Form.Item name="text">
                    <Input.TextArea
                        maxLength={MAX_MESSAGE_LENGTH}
                        placeholder="Message your friends"
                        autoSize={{ minRows: 1, maxRows: 5 }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        style={{ fontWeight: "bold" }}
                        icon={< SendOutlined />}
                        htmlType="submit"
                    >
                        Send
                    </Button>
                </Form.Item>
            </Space >
        </Form>
    )
}

export default ChatInput
