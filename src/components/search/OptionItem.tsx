import { Space, Col, Typography, Image } from "antd"
import { SearchOptionSong } from "../../types/Song"

interface OptionItemProps {
    song: SearchOptionSong
}

function OptionItem({ song }: OptionItemProps) {
    const { artist, name, thumbnail } = song

    return (
        <Space style={{ paddingTop: 6, paddingBottom: 6 }}>
            <Image
                src={thumbnail}
                alt={name}
                preview={false}
                width={64}
                height={64}
                style={{
                    objectFit: "cover",
                    borderRadius: 4
                }}
            />
            <Col>
                <Typography.Title level={5} style={{ margin: 0 }}>
                    {name}
                </Typography.Title>

                <Typography.Text style={{ margin: 0 }}>
                    {artist}
                </Typography.Text>
            </Col>
        </Space>
    )
}

export default OptionItem
