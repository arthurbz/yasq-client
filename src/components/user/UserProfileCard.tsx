import { Avatar, Row } from "antd"
import { User } from "../../types/User"

interface UserProfileCardProps {
    user?: User
}

function UserProfileCard({ user }: UserProfileCardProps) {
    const avatarUrl = user ? `${import.meta.env.VITE_SERVER}${user.pfpPath}` : null

    return (
        <Row>
            <Avatar
                shape="circle"
                alt={`Avatar picture for ${user?.name}`}
                src={avatarUrl}
                size="large"
            />
        </Row>
    )
}

export default UserProfileCard
