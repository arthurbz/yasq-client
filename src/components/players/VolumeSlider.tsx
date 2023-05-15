import { Col, Row, Slider, Button, Tooltip } from "antd"
import { SoundTwoTone, SoundOutlined } from "@ant-design/icons"
import { useContext } from "react"
import GlobalPlayerContext from "../../contexts/GlobalPlayerContext"

function VolumeSlider() {
    const { volume, setVolume } = useContext(GlobalPlayerContext)

    const onChange = (value: number) => {
        setVolume({
            value: value,
            isMuted: false
        })
    }

    const handleClick = () => {
        setVolume(prevState => {
            return {
                value: prevState.value,
                isMuted: !prevState.isMuted,
            }
        })
    }

    return (
        <Row gutter={8} style={{ alignItems: "center" }}>
            <Col>
                <Tooltip title={volume.isMuted ? "Unmute" : "Mute"}>
                    <Button
                        type="text"
                        shape="round"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 32,
                            width: 32,
                            fontSize: 20
                        }}
                        onClick={handleClick}
                    >
                        {volume.isMuted ? <SoundOutlined /> : <SoundTwoTone />}
                    </Button>
                </Tooltip>
            </Col>

            <Col flex="auto">
                <Slider
                    tooltip={{ open: false }}
                    value={volume.isMuted ? 0 : volume.value}
                    defaultValue={volume.value}
                    onChange={onChange}
                />
            </Col>
        </Row>
    )
}

export default VolumeSlider
