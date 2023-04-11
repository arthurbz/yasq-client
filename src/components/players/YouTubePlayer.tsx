import YouTube, { YouTubeEvent } from "react-youtube"

function YouTubePlayer() {
    let player: any | null
    const onReady = (event: YouTubeEvent) => player = event.target
    const play = () => player?.playVideo()
    const pause = () => player?.pauseVideo()
    const seekTo = () => player?.seekTo(60)

    return (
        <div>
            <button onClick={play}>
                play
            </button>

            <button onClick={pause}>
                pause
            </button>

            <button onClick={seekTo}>
                seek to 1min
            </button>

            <div style={{ display: "none" }}>
                <YouTube
                    videoId={"LnS0f46tx_E"}
                    onReady={onReady}
                />
            </div>
        </div>
    )
}

export default YouTubePlayer
