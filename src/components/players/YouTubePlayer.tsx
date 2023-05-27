import { useState, useEffect, useContext } from "react"
import YouTube, { YouTubeEvent, YouTubePlayer as ReactYouTubePlayer } from "react-youtube"
import GlobalPlayerContext from "../../contexts/GlobalPlayerContext"

/*
    Help:
    - https://developers.google.com/youtube/iframe_api_reference
    - https://developers.google.com/youtube/player_parameters
*/

function YouTubePlayer() {
    const {
        song,
        setIsPlaying,
        isPlaying,
        setIsReady,
        volume,
        elapsedTime,
        setSongHasEnded
    } = useContext(GlobalPlayerContext)
    const [player, setPlayer] = useState<ReactYouTubePlayer | null>()

    useEffect(() => {
        // The "g" variable is the iframe element in the DOM, so it can't be null
        if (!player?.g)
            return

        // After the player is ready, it will setIsPlaying to force the correct state
        isPlaying ? player?.playVideo() : player?.pauseVideo()
    }, [isPlaying])

    useEffect(() => {
        // The "g" variable is the iframe element in the DOM, so it can't be null
        if (!player?.g)
            return

        setIsReady(true)

        /*
            TODO: Still need to find out why after changing song, its still starting from the middle
            Seems like it's something with YouTube, like the user was already watching the video
        */
        player.getDuration() // Forces refresh of seekTo()
        player.seekTo(elapsedTime, true) // Seek to the room song elapsed time

        if (!isPlaying)
            player.pauseVideo()

        setIsPlaying(isPlaying => isPlaying) // Hacky way to force player to the correct state after the iframe is ready
    }, [player])

    useEffect(() => {
        if (!player)
            return

        player.setVolume(volume.value)

        // NOTE: If we always unmute, when volume is set to 0 it'll keep reproducing sounds
        if (player.isMuted() && !volume.isMuted && volume.value != 0)
            player.unMute()

        if (!player.isMuted() && volume.isMuted)
            player.mute()
    }, [volume])

    const onReady = (event: YouTubeEvent) => {
        if (player)
            player?.destroy()

        setPlayer(event.target)
    }

    const onError = () => {
        setIsReady(false)
        setPlayer(null)
    }

    const onEnd = () => {
        setSongHasEnded(true)
    }

    return (
        <YouTube
            // style={{ display: "none" }}
            videoId={song?.originId}
            onReady={onReady}
            onError={onError}
            onEnd={onEnd}
        />
    )
}

export default YouTubePlayer
