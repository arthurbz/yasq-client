import { AutoComplete, Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"

function SearchBar() {
    const handleSearch = async (value: string) => {
        await fetch(`${import.meta.env.VITE_SERVER}/search/youtube?query=${value}`,
            { method: "GET" })
            .then(response => response.json())
            .then(data => console.log(data))
    }

    return (
        <AutoComplete
            style={{ width: "100%" }}
            onSearch={handleSearch}
        >
            <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                size="large"
            />
        </AutoComplete>
    )
}

export default SearchBar
