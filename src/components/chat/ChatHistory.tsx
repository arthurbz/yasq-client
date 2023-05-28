import { useState, useEffect } from "react"
import { socket } from "../../plugins/SocketInstance"

// Types
import { TextMessage, Action } from "../../types/Action"
import { RoomAction } from "../../types/RoomAction"

// Componentes
import ChatMessage from "./ChatMessage"
import SongAdded from "./roomActions/SongAdded"
import UserJoined from "./roomActions/UserJoined"
import StateChanged from "./roomActions/StateChanged"
import ChangeSong from "./roomActions/SongChanged"

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
        socket.on("songChanged", pushMessageToHistory)

        return () => {
            socket.off("textMessage")
            socket.off("songAdded")
            socket.off("userJoined")
            socket.off("stateChanged")
            socket.off("songChanged")
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
                            textMessage={message.content}
                            date={message.date}
                        />
                    if (message.content.type == "songAdded")
                        return <SongAdded
                            key={index}
                            songAdded={message.content}
                        />
                    if (message.content.type == "userJoined")
                        return <UserJoined
                            key={index}
                            userJoined={message.content}
                        />
                    if (message.content.type == "stateChanged")
                        return <StateChanged
                            key={index}
                            stateChanged={message.content}
                        />
                    if (message.content.type == "changeSong")
                        return <ChangeSong
                            key={index}
                            changeSong={message.content}
                        />
                })
            }
        </div>
    )
}

export default ChatHistory
