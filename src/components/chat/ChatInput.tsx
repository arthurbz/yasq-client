import { useContext } from "react"
import { Space, Input, Button, Form } from "antd"
import { SendOutlined } from "@ant-design/icons"
import { socket } from "../../plugins/SocketInstance"
import dayjs from "dayjs"
import GlobalDataContext from "../../contexts/GlobalDataContext"
import { Action, TextMessage } from "../../types/Action"

const MAX_MESSAGE_LENGTH = 500

function ChatInput() {
    const { room, user } = useContext(GlobalDataContext)
    const [form] = Form.useForm()

    const sendMessage = (formValues: { text: string }) => {
        const { text } = formValues

        if (!user || !room || !text || text.length > MAX_MESSAGE_LENGTH)
            return

        const message: Action<TextMessage> = {
            roomId: room.id,
            content: {
                user,
                text,
                type: "textMessage"
            },
            date: dayjs().unix()
        }

        form.resetFields()
        socket.emit("textMessage", message)
    }

    const onKeyDown = (event: any) => {
        if (event.key === "Enter" && !event.shiftKey)
            form.submit()
    }

    return (
        <Form form={form} onFinish={sendMessage} onKeyDown={onKeyDown}>
            <Space style={{ alignItems: "flex-start" }}>
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
