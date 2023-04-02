import YouTube, { YouTubeEvent } from "react-youtube"

function App() {
    let player: any | null

    const onReady = (event: YouTubeEvent) => {
        console.log("ready")
        player = event.target
    }

    const play = () => {
        console.log("play")
        player?.playVideo()
    }

    const pause = () => {
        console.log("pause")
        player?.pauseVideo()
    }

    const seekTo = () => {
        player?.seekTo(60)
    }

    return (
        <div className="App">
            <button onClick={play}>
                play
            </button>

            <button onClick={pause}>
                pause
            </button>

            <button onClick={seekTo}>
                seek to 1min
            </button>

            <YouTube
                videoId={"hC8CH0Z3L54"}
                onReady={onReady}
            />
        </div>
    )
}

export default App
