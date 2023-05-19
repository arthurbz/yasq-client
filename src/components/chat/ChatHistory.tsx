import { useState, useEffect } from "react"
import { socket } from "../../plugins/SocketInstance"
import { Message } from "../../types/Message"
import ChatMessage from "./ChatMessage"

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
                messageHistory.map(m => <ChatMessage key={`${m.user.id}-${m.date}`} message={m} />)
            }
        </div>
    )
}

export default ChatHistory
