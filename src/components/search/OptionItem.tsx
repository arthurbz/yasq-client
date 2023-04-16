import { Space, Col, Typography, Image } from "antd"
import { SearchItemOption } from "../../types/SearchItemOption"

interface OptionItemProps {
    searchItemOption: SearchItemOption
}

function OptionItem(props: OptionItemProps) {
    const { author, title, thumbnail } = props.searchItemOption

    return (
        <Space style={{ paddingTop: 6, paddingBottom: 6 }}>
            <Image
                src={thumbnail}
                alt={title}
                preview={false}
                width={96}
                height={96}
                style={{
                    objectFit: "cover",
                    borderRadius: 4
                }}
            />
            <Col>
                <Typography.Title level={5} style={{ margin: 0 }}>
                    {title}
                </Typography.Title>

                <Typography.Text style={{ margin: 0 }}>
                    {author}
                </Typography.Text>
            </Col>
        </Space>
    )
}

export default OptionItem
