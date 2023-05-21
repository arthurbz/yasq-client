import { useState, useEffect } from "react"
import { socket } from "../../plugins/SocketInstance"
import { TextMessage, Message } from "../../types/Message"
import ChatMessage from "./ChatMessage"
import { RoomAction } from "../../types/RoomAction"

function ChatHistory() {
    const [messageHistory, setMessageHistory] = useState<Message<TextMessage | RoomAction>[]>([])

    useEffect(() => {
        socket.on("receiveMessage", (message: Message<TextMessage>) => {
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
                messageHistory.map((message, index) => {
                    if (message.content.type == "textMessage")
                        return <ChatMessage
                            key={index}
                            message={message as Message<TextMessage>}
                        />
                })
            }
        </div>
    )
}

export default ChatHistory
