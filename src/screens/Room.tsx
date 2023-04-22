import { Layout, Typography } from "antd"
import SearchBar from "../components/search/SearchBar"

function Room() {
    return (
        <Layout>
            <Typography>
                Room
                <SearchBar />
            </Typography>
        </Layout>
    )
}

export default Room
