import { Row, Typography } from "antd"
import { User } from "../../types/User"
import { CrownOutlined } from "@ant-design/icons"

interface UserItemProps {
    user: User
    isOwner: boolean
}

function UserItem({ user, isOwner }: UserItemProps) {
    const { name } = user

    return (
        <Row
            wrap={false}
            gutter={16}
            style={{
                padding: "8px 16px 8px 16px",
                width: "100%",
                alignItems: "center"
            }}
        >
            {isOwner ? <CrownOutlined style={{ fontSize: 24, marginRight: 4 }} /> : null}

            <Typography.Title ellipsis level={5} style={{ margin: 0 }}>
                {name}
            </Typography.Title>
        </Row>
    )
}

export default UserItem
