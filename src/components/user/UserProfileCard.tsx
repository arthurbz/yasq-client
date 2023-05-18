import { Avatar, Card, Space, Typography } from "antd"
import { User } from "../../types/User"

interface UserProfileCardProps {
    user?: User
}

function UserProfileCard({ user }: UserProfileCardProps) {
    const avatarUrl = user ? `${import.meta.env.VITE_SERVER}${user.pfpPath}` : null

    return (
        <Card>
            <Space direction="horizontal">
                <Avatar
                    shape="circle"
                    alt={`Avatar picture for ${user?.name}`}
                    src={avatarUrl}
                    size={"large"}
                />

                <Typography.Title ellipsis level={5} style={{ margin: 0 }}>
                    {user?.name}
                </Typography.Title>
            </Space>
        </Card>
    )
}

export default UserProfileCard
