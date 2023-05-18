import { useState, useEffect } from "react"
import { socket } from "../../plugins/SocketInstance"
import { Col, Row } from "antd"
import { Message } from "../../types/Message"

function ChatHistory() {
    const [messageHistory, setMessageHistory] = useState<Message[]>([])

    useEffect(() => {
        socket.on("receiveMessage", (message: Message) => {
            setMessageHistory(prevState => [...prevState, message])
        })

        return () => {
            socket.off("receiveMessage")
        }
    }, [])

    return (
        <div>
            Chat History
            {
                messageHistory.map(m => {
                    return (
                        <Col key={`${m.user.id}-${m.date}`}>
                            <Row>
                                {m.user.name}
                            </Row>
                            <Row>
                                {m.message}
                            </Row>
                        </Col>
                    )
                })
            }
        </div>
    )
}

export default ChatHistory
