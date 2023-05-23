import { useState } from "react"
import { Avatar, Card, Row, Col, Typography } from "antd"
import dayjs from "dayjs"
import { TextMessage } from "../../types/Action"

interface MessageProps {
    textMessage: TextMessage
    date: number
}

function ChatMessage({ textMessage, date }: MessageProps) {
    const { user, text } = textMessage
    const [ellipsis, setEllipsis] = useState(true)

    const avatarUrl = user ? `${import.meta.env.VITE_SERVER}${user.pfpPath}` : null
    const dayjsDate = dayjs.unix(date)
    const includeDay = dayjs().diff(dayjsDate, "days") > 1
    const formattedDate = includeDay ? dayjsDate.format("D, MMM hh:mm A") : dayjsDate.format("hh:mm A")

    const onExpand = () => setEllipsis(false)

    return (
        <Row style={{ gap: 4 }}>
            <Avatar
                shape="circle"
                alt={`Avatar picture for ${user?.name}`}
                size={"large"}
                src={avatarUrl}
                style={{ padding: 0 }}
            />

            <Card bodyStyle={{ padding: "8px 16px" }}>
                <Col>
                    <Row style={{ gap: 8 }}>
                        <Typography.Text ellipsis style={{ margin: 0, fontWeight: "bold" }}>
                            {user?.name}
                        </Typography.Text>

                        <Typography.Text ellipsis style={{ margin: 0, color: "grey" }}>
                            {formattedDate}
                        </Typography.Text>
                    </Row>

                    <Typography.Paragraph
                        ellipsis={ellipsis ? { rows: 5, expandable: true, onExpand: onExpand, symbol: "read more" } : false}
                        style={{
                            margin: 0,
                            maxHeight: 128,
                            maxWidth: 300,
                            textAlign: "justify",
                            textJustify: "inter-word",
                            overflowY: ellipsis ? "unset" : "scroll"
                        }}
                    >
                        {text}
                    </Typography.Paragraph>
                </Col>
            </Card>
        </Row>
    )
}

export default ChatMessage
