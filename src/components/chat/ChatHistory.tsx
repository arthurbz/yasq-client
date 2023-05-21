import { useState, useEffect } from "react"
import { socket } from "../../plugins/SocketInstance"
import { TextMessage, Action } from "../../types/Action"
import ChatMessage from "./ChatMessage"
import { RoomAction } from "../../types/RoomAction"

function ChatHistory() {
    const [messageHistory, setMessageHistory] = useState<Action<TextMessage | RoomAction>[]>([])

    const pushMessageToHistory = (message: Action<TextMessage | RoomAction>) => {
        setMessageHistory(prevState => [...prevState, message])
    }

    useEffect(() => {
        socket.on("textMessage", pushMessageToHistory)
        socket.on("songAdded", pushMessageToHistory)
        socket.on("userJoined", pushMessageToHistory)
        socket.on("stateChanged", pushMessageToHistory)

        return () => {
            socket.off("textMessage")
            socket.off("songAdded")
            socket.off("userJoined")
            socket.off("stateChanged")
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
                            message={message as Action<TextMessage>}
                        />
                    else
                        return <>
                            {message.content.type}
                        </>
                })
            }
        </div>
    )
}

export default ChatHistory
