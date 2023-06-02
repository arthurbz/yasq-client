import { Col } from "antd"

function ThreeDotsAvatar() {
    return (
        <Col
            style={{
                width: 46,
                height: 46,
                background: "#61dcc9",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bolder",
                fontSize: 42,
                color: "black",
                boxShadow: "0px 0px 1px #61dcc9",
                userSelect: "none",
                marginLeft: -24
            }}
        >
            ...
        </Col>
    )
}

export default ThreeDotsAvatar
