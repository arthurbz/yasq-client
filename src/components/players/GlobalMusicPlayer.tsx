import { useState, useEffect } from "react"
import { Row, Col, Button } from "antd"
import { Song } from "../../types/Song"
import { PlayCircleFilled, PauseCircleFilled } from "@ant-design/icons"

// Components
import AlbumCover from "../song/AlbumCover"

// Contexts
import GlobalPlayerContext, { GlobalPlayerContextParams } from "../../contexts/GlobalPlayerContext"
import YouTubePlayer from "./YouTubePlayer"

const placeholderSong1 = {
    id: "6442e0d686696084024069e1",
    originId: "c0-hvjV2A5Y",
    name: "Fred again.. | Boiler Room: London",
    source: "youtube",
    artist: "Boiler Room",
    thumbnail: "https://i.ytimg.com/vi/c0-hvjV2A5Y/maxresdefault.jpg"
} as Song | undefined

const placeholderSong2 = {
    id: "6442e0bf86696084024069e0",
    originId: "hC8CH0Z3L54",
    name: "FKJ & Masego - Tadow",
    source: "youtube",
    artist: "Fkj",
    thumbnail: "https://i.ytimg.com/vi/hC8CH0Z3L54/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDnVKkMDpkHnzoJIjSiDWYWCSDReA"
} as Song | undefined

function GlobalMusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [song, setSong] = useState<Song | undefined>(placeholderSong1)
    const globalPlayerContextParams: GlobalPlayerContextParams = {
        isPlaying,
        setIsPlaying,
        isReady,
        setIsReady,
        song,
        setSong
    }

    const handleClick = () => {
        if (!isReady) {
            console.log("Not Ready")
            return
        }

        isPlaying ? setIsPlaying(false) : setIsPlaying(true)
    }

    const dumbChangePlaceholderSong = () => {
        setIsPlaying(false)
        setSong(prevState => {
            if (prevState?.originId == placeholderSong1?.originId)
                return placeholderSong2

            return placeholderSong1
        })
    }

    return (
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

            <Col span={1}>
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

                <Button onClick={dumbChangePlaceholderSong}>
                    Change Song
                </Button>
            </Col>

            <GlobalPlayerContext.Provider value={globalPlayerContextParams}>
                <YouTubePlayer />
            </GlobalPlayerContext.Provider>
        </Row>
    )
}

export default GlobalMusicPlayer
