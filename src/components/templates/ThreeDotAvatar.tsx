import { Col } from "antd"

function ThreeDotsAvatar() {
    return (
        <Col
            style={{
                width: 46,
                height: 46,
                background: "#000",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bolder",
                fontSize: 42,
                color: "#FFF",
                boxShadow: "0px 0px 3px #F7F7F7",
                userSelect: "none",
                marginLeft: -24
            }}
        >
            ...
        </Col>
    )
}

export default ThreeDotsAvatar
