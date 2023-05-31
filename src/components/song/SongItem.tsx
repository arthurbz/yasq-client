import { Row, Col, Typography } from "antd"
import { theme } from "../../themes/AppThemes"
import { Song } from "../../types/Song"
import AlbumCover from "./AlbumCover"

interface SongProps {
    song: Song
    isPlaying?: boolean
}

function SongItem({ song, isPlaying }: SongProps) {
    const { name, artist, thumbnail } = song

    return (
        <Row
            wrap={false}
            gutter={16}
            style={{
                width: "100%",
                border: isPlaying ? `3px ${theme.token?.colorPrimary} solid` : "",
                borderRadius: 8
            }}
        >
            <AlbumCover
                thumbnail={thumbnail}
                name={name}
                height={64}
                width={64}
            />

            <Col style={{ minWidth: 0, paddingTop: 4 }}>
                <Typography.Title ellipsis level={5} style={{ margin: 0 }}>
                    {name}
                </Typography.Title>

                <Typography.Text ellipsis style={{ margin: 0 }}>
                    {artist}
                </Typography.Text>
            </Col>
        </Row>
    )
}

export default SongItem
