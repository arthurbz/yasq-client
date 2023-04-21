import { useState, useEffect } from "react"
import { AutoComplete, Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import OptionItem from "./OptionItem"
import { Song } from "../../types/Song"

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState<any[]>()
    const controller = new AbortController()

    useEffect(() => {
        if (!searchQuery)
            return

        setLoading(true)

        const searchTimeout = setTimeout(() => {
            fetchSearchData(searchQuery)
        }, 350)

        return () => {
            setLoading(false)
            clearTimeout(searchTimeout)
            controller.abort()
        }
    }, [searchQuery])

    const onChange = (value: string) => {
        setSearchQuery(value)
    }

    const onSelect = (value: string) => {
        // TO-DO - Blur the AutoComplete component
        setSearchQuery("")
        setOptions(undefined)
        console.log(value)
    }

    const createOptions = (searchResults: any[]) => {
        const newOptions = searchResults.map((option: Song) => {
            return {
                value: option.originId,
                label: <OptionItem song={option} />
            }
        })

        setOptions(newOptions)
    }

    const fetchSearchData = async (query: string) => {
        console.log("Searching for:", query)
        await fetch(`${import.meta.env.VITE_SERVER}/search/youtube?query=${query}`,
            { method: "GET", signal: controller.signal })
            .then(response => response.json())
            .then(data => {
                setLoading(false)
                createOptions(data)
            })
            .catch(error => { return })
    }

    return (
        <AutoComplete
            style={{ width: 400 }}
            options={options}
            value={searchQuery}
            onChange={onChange}
            onSelect={onSelect}
        >
            <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                size="large"
                style={{ height: 48 }}
            />
        </AutoComplete>
    )
}

export default SearchBar
