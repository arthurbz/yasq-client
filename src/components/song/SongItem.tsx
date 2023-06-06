import { useContext, useState } from "react"
import { DeleteOutlined } from "@ant-design/icons"
import { Button, Row, Col, Typography, App } from "antd"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { Song } from "../../types/Song"
import AlbumCover from "./AlbumCover"
import "./SongItemStyles.css"
import { ErrorResponseData } from "../../types/ErrorResponseData"
import { axios } from "../../plugins/AxiosInstance"
import GlobalDataContext from "../../contexts/GlobalDataContext"

interface SongProps {
    song: Song
    isPlaying?: boolean
}

function SongItem({ song, isPlaying }: SongProps) {
    const { notification } = App.useApp()
    const { room } = useContext(GlobalDataContext)
    const queryClient = useQueryClient()
    const [hovering, setHovering] = useState(false)
    const { name, artist, thumbnail } = song

    const { mutate: mutateRemoveSong } = useMutation<unknown, AxiosError<ErrorResponseData, any>>({
        mutationKey: ["song", "remove", song.id],
        mutationFn: async () => await axios.delete(`/song/remove/${song?.id}`).then(response => response.data),
        onSuccess: () => {
            queryClient.invalidateQueries(["song", "find", "room", room?.id])
            queryClient.setQueryData(
                ["song", "find", "room", room?.id],
                (oldData: Song[] | undefined) => {
                    return oldData?.filter(s => s.id != song.id)
                }
            )
        },
        onError: () => {
            notification.error({ message: "We are sorry, there was an error removing this song." })
        }
    })

    return (
        <Row
            className={isPlaying ? "ripple" : ""}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            wrap={false}
            gutter={16}
            style={{
                width: "100%",
                borderRadius: 6,
                padding: 2
            }}
        >
            <div className={hovering ? "hover-item-fade-out" : ""}>
                <AlbumCover
                    thumbnail={thumbnail}
                    name={name}
                    height={64}
                    width={64}
                />
            </div>

            <Col
                className={hovering ? "hover-item-fade-out" : ""}
                style={{ minWidth: 0, paddingTop: 4 }}
            >
                <Typography.Title ellipsis level={5} style={{ margin: 0 }}>
                    {name}
                </Typography.Title>

                <Typography.Text ellipsis style={{ margin: 0 }}>
                    {artist}
                </Typography.Text>
            </Col>

            {hovering
                ?
                <Col
                    className={hovering ? "hover-item-fade-in" : ""}
                    style={{ alignSelf: "center" }}
                >
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => mutateRemoveSong()}
                    />
                </Col>
                : null
            }
        </Row>
    )
}

export default SongItem
