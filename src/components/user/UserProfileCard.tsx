import { useState } from "react"
import { Avatar, Card, Space, Typography } from "antd"
import { useQuery } from "@tanstack/react-query"
import { axios } from "../../plugins/AxiosInstance"
import { AxiosError } from "axios"
import { getUserId } from "../../utils/StorageUtils"

// Types
import { User } from "../../types/User"
import { ErrorResponseData } from "../../types/ErrorResponseData"

function UserProfileCard() {
    const [user, setUser] = useState<User | undefined>()
    const userId = getUserId()

    useQuery<User, AxiosError<ErrorResponseData, any>>({
        queryKey: ["room", "find", userId],
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        retryDelay: 250,
        queryFn: async () => await axios.get(`/user/find/${userId}`).then(response => response.data),
        onSuccess: user => setUser(user),
    })

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
