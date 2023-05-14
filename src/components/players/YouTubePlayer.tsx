import { useState, useEffect, useContext } from "react"
import YouTube, { YouTubeEvent, YouTubePlayer as ReactYouTubePlayer } from "react-youtube"
import GlobalPlayerContext from "../../contexts/GlobalPlayerContext"

/*
    Help:
    - https://developers.google.com/youtube/iframe_api_reference
    - https://developers.google.com/youtube/player_parameters
*/

function YouTubePlayer() {
    const { song, isPlaying, isReady, setIsReady, volume } = useContext(GlobalPlayerContext)
    const [player, setPlayer] = useState<ReactYouTubePlayer | undefined>()

    useEffect(() => {
        // TODO: Think of a way to "wait" for it to be ready and then do the action
        if (!isReady)
            return

        isPlaying ? player?.playVideo() : player?.pauseVideo()
    }, [isPlaying])

    useEffect(() => {
        setIsReady(false)
    }, [song])

    useEffect(() => {
        // The "g" variable is the iframe element in the DOM, so it can't be null
        if (!player?.g)
            return

        setIsReady(true)

        /*
            Seek to the first second and pause it.
            Otherwise the video could start in the middle if user was already watching it on YouTube.
            Also need to pause it, or else the video could start playing depending on the state.

            TODO:
                Still need to find out why after changing song, its still starting from the middle,
                like the user was already watching it.
        */
        player.getDuration()
        player.playVideo().seekTo(1, true).pauseVideo()
        console.log(player.getCurrentTime())
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
        setPlayer(undefined)
    }

    return (
        <YouTube
            style={{ display: "none" }}
            videoId={song?.originId}
            onReady={onReady}
            onError={onError}
        />
    )
}

export default YouTubePlayer
