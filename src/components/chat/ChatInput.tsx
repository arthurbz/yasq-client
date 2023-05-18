import { Space, Input, Button, Form } from "antd"
import { SendOutlined } from "@ant-design/icons"
import { socket } from "../../plugins/SocketInstance"
import { useContext } from "react"
import GlobalDataContext from "../../contexts/GlobalDataContext"

const MAX_MESSAGE_LENGTH = 500

function ChatInput() {
    const { room, user } = useContext(GlobalDataContext)

    const sendMessage = (form: { message: string }) => {
        const { message } = form

        if (!user || !room || !message || message.length > MAX_MESSAGE_LENGTH)
            return

        socket.emit("message", {
            name: user.name,
            pfpPath: user.pfpPath,
            message: message,
            date: new Date()
        })
    }

    return (
        <Form onFinish={sendMessage}>
            <Space>
                <Form.Item name="message">
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
