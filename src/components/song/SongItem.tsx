import { useState } from "react"
import { DeleteOutlined } from "@ant-design/icons"
import { Button, Row, Col, Typography } from "antd"
import { Song } from "../../types/Song"
import AlbumCover from "./AlbumCover"
import "./SongItemStyles.css"

interface SongProps {
    song: Song
    isPlaying?: boolean
}

function SongItem({ song, isPlaying }: SongProps) {
    const [hovering, setHovering] = useState(false)
    const { name, artist, thumbnail } = song

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
                    />
                </Col>
                : null
            }
        </Row>
    )
}

export default SongItem
