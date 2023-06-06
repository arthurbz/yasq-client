import { CSSProperties, useContext, useEffect, useState } from "react"
import { Row, Col, Button, App, Tooltip, Typography } from "antd"
import { PlayCircleFilled, PauseCircleFilled, ReloadOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons"
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
import { RoomState } from "../../types/Room"
import { StateChanged } from "../../types/RoomAction"
import { Action } from "../../types/Action"

import { theme } from "../../themes/AppThemes"

function GlobalMusicPlayer() {
    const { notification } = App.useApp()
    const { room, user, song, setSong } = useContext(GlobalDataContext)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [volume, setVolume] = useState<Volume>({ value: 15, isMuted: false })
    const [elapsedTime, setElapsedTime] = useState(0)
    const [songHasEnded, setSongHasEnded] = useState(false)
    const [buildPlayer, setBuildPlayer] = useState(false)
    const globalPlayerContextParams: GlobalPlayerContextParams = {
        isPlaying,
        setIsPlaying,
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
            } else {
                setBuildPlayer(false)
            }

            console.debug(`SongId: ${currentSong?.originId} \nSong: ${currentSong?.name} \nArtist: ${currentSong?.artist} \nElapsed: ${songElapsedTime} \nPlaying: ${isPlaying}`)
        })
        socket.emit("currentState", room.id)

        return () => {
            socket.off("play")
            socket.off("pause")
            socket.off("currentState")
            setSong(undefined)
        }
    }, [room])

    useEffect(() => {
        if (!songHasEnded || !room || !user)
            return

        socket.emit("musicHasEnded", {
            roomId: room.id,
            content: { user, type: "musicHasEnded" },
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

    const changeSong = (goTo: "previous" | "next") => {
        if (!room || !user)
            return

        socket.emit("changeSong", {
            roomId: room.id,
            content: {
                user,
                goTo,
                type: "changeSong"
            },
            date: dayjs().unix()
        })
    }

    return (
        <GlobalPlayerContext.Provider value={globalPlayerContextParams}>
            <Row
                style={{
                    width: "100%",
                    padding: 16,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderColor: theme.token?.colorPrimary
                }}
                align="middle"
                gutter={32}
            >
                {buildPlayer && <YouTubePlayer />}

                <Col
                    xs={{ span: 12, order: 1 }}
                    sm={{ span: 12, order: 1 }}
                    md={{ span: 12, order: 1 }}
                    lg={{ span: 4, order: 1 }}
                    xl={{ span: 4, order: 1 }}
                    xxl={{ span: 4, order: 1 }}
                    style={{ padding: 0 }}
                >
                    <Row gutter={16} style={{ display: "flex" }} wrap={false}>
                        <Col>
                            <AlbumCover
                                thumbnail={song?.thumbnail}
                                name={song?.name}
                                height={96}
                                width={96}
                            />
                        </Col>

                        <Col>
                            <Typography.Text ellipsis style={{ margin: 0, fontWeight: "bolder" }}>
                                {song?.name}
                            </Typography.Text>

                            <Typography.Text ellipsis style={{ margin: 0, color: "grey" }}>
                                {song?.artist}
                            </Typography.Text>
                        </Col>
                    </Row>
                </Col>

                <Col
                    xs={{ span: 24, order: 3 }}
                    sm={{ span: 24, order: 3 }}
                    md={{ span: 24, order: 3 }}
                    lg={{ span: 14, order: 2 }}
                    xl={{ span: 14, order: 2 }}
                    xxl={{ span: 16, order: 2 }}
                >
                    <Row gutter={16} align="middle" justify="center">
                        <Col
                            xs={{ span: 6, order: 1 }}
                            sm={{ span: 6, order: 1 }}
                            md={{ span: 4, order: 1 }}
                            lg={{ span: 3, order: 1 }}
                            style={{ display: "flex", justifyContent: "center" }}
                        >
                            <Tooltip title="Previous">
                                <Button
                                    type="text"
                                    shape="round"
                                    disabled={!song}
                                    style={iconButtonStyles}
                                    onClick={() => changeSong("previous")}
                                >
                                    <StepBackwardOutlined style={{ fontSize: 52 }} />
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col
                            xs={{ span: 6, order: 2 }}
                            sm={{ span: 6, order: 2 }}
                            md={{ span: 4, order: 2 }}
                            lg={{ span: 3, order: 2 }}
                            style={{ display: "flex", justifyContent: "center" }}
                        >
                            <Tooltip title={isPlaying ? "Pause" : "Play"}>
                                <Button
                                    type="text"
                                    shape="round"
                                    disabled={!song}
                                    style={iconButtonStyles}
                                    onClick={handleClick}
                                >
                                    {isPlaying
                                        ? <PauseCircleFilled style={{ fontSize: 52 }} />
                                        : <PlayCircleFilled style={{ fontSize: 52 }} />
                                    }
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col
                            xs={{ span: 6, order: 3 }}
                            sm={{ span: 6, order: 3 }}
                            md={{ span: 4, order: 3 }}
                            lg={{ span: 3, order: 3 }}
                            style={{ display: "flex", justifyContent: "center" }}
                        >
                            <Tooltip title="Next">
                                <Button
                                    type="text"
                                    shape="round"
                                    disabled={!song}
                                    style={iconButtonStyles}
                                    onClick={() => changeSong("next")}
                                >
                                    <StepForwardOutlined style={{ fontSize: 52 }} />
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col
                            xs={{ span: 6, order: 4 }}
                            sm={{ span: 6, order: 4 }}
                            md={{ span: 4, order: 4 }}
                            lg={{ span: 3, order: 4 }}
                            style={{ display: "flex", justifyContent: "center" }}
                        >
                            <Tooltip title="Refresh player" mouseEnterDelay={0.7}>
                                <Button
                                    type="text"
                                    shape="round"
                                    disabled={!song}
                                    style={{ ...iconButtonStyles, width: 32, height: 32 }}
                                    onClick={reloadPlayer}
                                >
                                    <ReloadOutlined style={{ fontSize: 18 }} />
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                </Col>

                <Col
                    xs={{ span: 12, order: 2 }}
                    sm={{ span: 12, order: 2 }}
                    md={{ span: 12, order: 2 }}
                    lg={{ span: 6, order: 3 }}
                    xl={{ span: 6, order: 3 }}
                    xxl={{ span: 4, order: 3 }}
                >
                    <VolumeSlider />
                </Col>
            </Row >
        </GlobalPlayerContext.Provider >
    )
}

const iconButtonStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: 64,
    width: 64
}

export default GlobalMusicPlayer
