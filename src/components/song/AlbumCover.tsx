import { Typography } from "antd"
import { ReactNode, CSSProperties } from "react"

interface AlbumCoverProps {
    thumbnail?: string
    name?: string
    width: string | number
    height: string | number
}

function AlbumCover({ thumbnail, name, height, width }: AlbumCoverProps) {
    let element: ReactNode
    const commonStyles: CSSProperties = {
        borderRadius: 4,
        height: height,
        width: width,
    }

    if (thumbnail) {
        element =
            (
                <img
                    src={thumbnail}
                    alt={`Cover for ${name}`}
                    style={{
                        objectFit: "cover",
                        ...commonStyles
                    }}
                />
            )
    } else {
        element = (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                    padding: 16,
                    overflow: "hidden",
                    ...commonStyles
                }}
            >
                <Typography.Text ellipsis style={{ color: "white", fontWeight: "bold" }}>
                    {name}
                </Typography.Text>
            </div>
        )
    }

    return (
        <div style={commonStyles}>
            {element}
        </div>
    )
}

export default AlbumCover
