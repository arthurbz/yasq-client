import { useState, useEffect, useContext } from "react"
import YouTube, { YouTubeEvent } from "react-youtube"
import GlobalPlayerContext from "../../contexts/GlobalPlayerContext"

function YouTubePlayer() {
    const { song, isPlaying, setIsReady } = useContext(GlobalPlayerContext)
    const [player, setPlayer] = useState<any | undefined>()

    useEffect(() => {
        isPlaying ? player?.playVideo() : player?.pauseVideo()
    }, [isPlaying])

    useEffect(() => {
        setIsReady(false)
    }, [song])

    const onReady = (event: YouTubeEvent) => {
        setIsReady(true)
        setPlayer(event.target)
    }

    return (
        <YouTube
            style={{ display: "none" }}
            videoId={song?.originId}
            onReady={onReady}
        />
    )
}

export default YouTubePlayer
