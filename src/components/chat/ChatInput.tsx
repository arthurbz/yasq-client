import { useContext } from "react"
import { Row, Col, Input, Button, Form } from "antd"
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
            <Row align="bottom" style={{ padding: 32 }}>
                <Col
                    xs={{ span: 14, order: 1 }}
                    sm={{ span: 16, order: 1 }}
                    md={{ span: 16, order: 1 }}
                    lg={{ span: 16, order: 1 }}
                    xl={{ span: 18, order: 1 }}
                    xxl={{ span: 20, order: 1 }}
                >
                    <Form.Item name="text" style={{ margin: 0 }}>
                        <Input.TextArea
                            size="large"
                            maxLength={MAX_MESSAGE_LENGTH}
                            placeholder="Message your friends"
                            autoSize={{ minRows: 0, maxRows: 5 }}
                        />
                    </Form.Item>
                </Col>

                <Col
                    xs={{ span: 10, order: 2 }}
                    sm={{ span: 8, order: 2 }}
                    md={{ span: 8, order: 2 }}
                    lg={{ span: 8, order: 2 }}
                    xl={{ span: 6, order: 2 }}
                    xxl={{ span: 4, order: 2 }}
                >
                    <Form.Item style={{ margin: 0 }}>
                        <Button
                            size="large"
                            type="primary"
                            style={{ fontWeight: "bold", marginLeft: 32 }}
                            icon={< SendOutlined />}
                            htmlType="submit"
                        >
                            Send
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default ChatInput
