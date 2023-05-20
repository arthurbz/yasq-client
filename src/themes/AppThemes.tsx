import { theme as AntdTheme, ThemeConfig } from "antd"

const theme: ThemeConfig = {
    algorithm: AntdTheme.darkAlgorithm,
    token: {
        wireframe: true,
        fontFamily: "Nunito",
        colorPrimary: "#6fffe9",
        colorInfo: "#6fffe9",
        colorBgContainer: "#202020",
        colorTextPlaceholder: "#929292",
        colorBgBase: "#070707",
    }
}

export { theme }
