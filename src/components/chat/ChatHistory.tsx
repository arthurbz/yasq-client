import { useState, useEffect } from "react"
import { socket } from "../../plugins/SocketInstance"
import { List, Row } from "antd"

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

    const getActionComponent = (message: Action<TextMessage | RoomAction>, index: number) => {
        switch (message.content.type) {
            case "textMessage":
                return <ChatMessage key={index} textMessage={message.content} date={message.date} />
            case "songAdded":
                return <SongAdded key={index} songAdded={message.content} />
            case "userJoined":
                return <UserJoined key={index} userJoined={message.content} />
            case "stateChanged":
                return <StateChanged key={index} stateChanged={message.content} />
            case "changeSong":
                return <ChangeSong key={index} changeSong={message.content} />
        }
    }

    const renderItem = (message: Action<TextMessage | RoomAction>, index: number) => {
        const component = getActionComponent(message, index)

        if (!component)
            return

        if (message.content.type == "textMessage")
            return <Row style={{ margin: 16 }}>{component}</Row>

        return (
            <Row style={{ display: "flex", justifyContent: "center", margin: 16 }}>
                {component}
            </Row>
        )
    }

    return (
        <List
            locale={{ emptyText: "Nobody said anything yet." }}
            dataSource={messageHistory}
            renderItem={renderItem}
            style={{ height: "100%", width: "100%", overflow: "auto" }}
        />
    )
}

export default ChatHistory
