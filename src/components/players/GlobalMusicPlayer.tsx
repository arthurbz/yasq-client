import { useContext, useEffect, useState } from "react"
import { Row, Col, Button, App } from "antd"
import { PlayCircleFilled, PauseCircleFilled } from "@ant-design/icons"
import { socket } from "../../plugins/SocketInstance"

// Components
import AlbumCover from "../song/AlbumCover"
import YouTubePlayer from "./YouTubePlayer"
import VolumeSlider from "./VolumeSlider"

// Contexts
import GlobalDataContext from "../../contexts/GlobalDataContext"
import GlobalPlayerContext, { GlobalPlayerContextParams } from "../../contexts/GlobalPlayerContext"

// Types
import { Volume } from "../../types/Volume"
import { Song } from "../../types/Song"
import { RoomState } from "../../types/Room"

function GlobalMusicPlayer() {
    const { notification } = App.useApp()
    const { room } = useContext(GlobalDataContext)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [song, setSong] = useState<Song | undefined>()
    const [volume, setVolume] = useState<Volume>({ value: 15, isMuted: false })
    const [elapsedTime, setElapsedTime] = useState(0)
    const globalPlayerContextParams: GlobalPlayerContextParams = {
        isPlaying,
        setIsPlaying,
        song,
        setSong,
        elapsedTime,
        setElapsedTime,
        isReady,
        setIsReady,
        volume,
        setVolume,
    }

    useEffect(() => {
        if (!room)
            return

        socket.emit("currentState", room.id)
        socket.on("play", () => setIsPlaying(true))
        socket.on("pause", () => setIsPlaying(false))
        socket.on("currentState", (state: RoomState) => {
            const { currentSong, isPlaying, songElapsedTime } = state
            console.log(`(${song?.originId}) Song: ${song?.name} Artist: ${song?.artist} Elapsed: ${songElapsedTime} Playing: ${isPlaying}`)

            setSong(currentSong)
            setElapsedTime(songElapsedTime)
            setIsPlaying(isPlaying)
        })

        return () => {
            socket.off("play")
            socket.off("pause")
            socket.off("currentState")
        }
    }, [room])

    const handleClick = () => {
        // TODO: Think of a way to "wait" for it to be ready and then do the action
        if (!isReady)
            return

        if (!room) {
            notification.error({ message: "It seems like you are not in a room." })
            return
        }

        isPlaying ? socket.emit("pause", room.id) : socket.emit("play", room.id)
    }

    return (
        <GlobalPlayerContext.Provider value={globalPlayerContextParams}>
            <Row
                style={{
                    width: "100%",
                    borderRadius: 8,
                    overflow: "hidden",
                    padding: 16
                }}
                gutter={16}
            >
                <AlbumCover
                    thumbnail={song?.thumbnail}
                    name={song?.name}
                    height={256}
                    width={256}
                />

                <Col span={4}>
                    <Button
                        type="text"
                        shape="round"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 64,
                            width: 64
                        }}
                        onClick={handleClick}
                    >
                        {isPlaying
                            ? <PauseCircleFilled style={{ fontSize: 52 }} />
                            : <PlayCircleFilled style={{ fontSize: 52 }} />
                        }
                    </Button>
                </Col>

                <Col span={4}>
                    <VolumeSlider />
                </Col>

                <YouTubePlayer />
            </Row>
        </GlobalPlayerContext.Provider>
    )
}

export default GlobalMusicPlayer
