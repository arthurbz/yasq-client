import { useContext, useEffect, useState } from "react"
import { Row, Col, Button, App, Tooltip } from "antd"
import { PlayCircleFilled, PauseCircleFilled, ReloadOutlined } from "@ant-design/icons"
import { socket } from "../../plugins/SocketInstance"
import dayjs from "dayjs"

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
import { StateChanged } from "../../types/RoomAction"
import { Action } from "../../types/Action"

function GlobalMusicPlayer() {
    const { notification } = App.useApp()
    const { room, user } = useContext(GlobalDataContext)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [song, setSong] = useState<Song | null>(null)
    const [volume, setVolume] = useState<Volume>({ value: 15, isMuted: false })
    const [elapsedTime, setElapsedTime] = useState(0)
    const [songHasEnded, setSongHasEnded] = useState(false)
    const [buildPlayer, setBuildPlayer] = useState(false)
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
        songHasEnded,
        setSongHasEnded
    }

    useEffect(() => {
        if (!room)
            return

        socket.on("play", () => setIsPlaying(true))
        socket.on("pause", () => setIsPlaying(false))
        socket.on("currentState", (state: RoomState) => {
            const { currentSong, isPlaying, songElapsedTime } = state

            setElapsedTime(songElapsedTime)
            setIsPlaying(isPlaying)

            if (currentSong) {
                setSong(currentSong)
                setBuildPlayer(true)
            }

            console.debug(`SongId: ${currentSong?.originId} \nSong: ${currentSong?.name} \nArtist: ${currentSong?.artist} \nElapsed: ${songElapsedTime} \nPlaying: ${isPlaying}`)
        })
        socket.emit("currentState", room.id)

        return () => {
            socket.off("play")
            socket.off("pause")
            socket.off("currentState")
            setSong(null)
        }
    }, [room])

    useEffect(() => {
        if (!songHasEnded || !room || !user)
            return

        socket.emit("musicHasEnded", {
            roomId: room.id,
            content: { user },
            date: dayjs().unix()
        })
    }, [songHasEnded])

    const handleClick = () => {
        // TODO: Think of a way to "wait" for it to be ready and then do the action
        if (!isReady)
            return

        if (!room || !user) {
            notification.error({ message: "It seems like you are not in a room." })
            return
        }

        const action: Action<StateChanged> = {
            roomId: room.id,
            content: {
                isPlaying: !isPlaying,
                type: "stateChanged",
                user: user,
            },
            date: dayjs().unix()
        }

        isPlaying ? socket.emit("pause", action) : socket.emit("play", action)
    }

    const reloadPlayer = () => {
        if (room) {
            setBuildPlayer(false)
            socket.emit("currentState", room.id)
        }
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
                        disabled={!song}
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

                    <Tooltip title="Audio not playing? Refresh the player">
                        <Button
                            type="text"
                            shape="round"
                            disabled={!song}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 24,
                                width: 24
                            }}
                            onClick={reloadPlayer}
                        >
                            <ReloadOutlined style={{ fontSize: 18 }} />
                        </Button>
                    </Tooltip>
                </Col>

                <Col span={4}>
                    <VolumeSlider />
                </Col>

                {buildPlayer && <YouTubePlayer />}
            </Row>
        </GlobalPlayerContext.Provider>
    )
}

export default GlobalMusicPlayer
