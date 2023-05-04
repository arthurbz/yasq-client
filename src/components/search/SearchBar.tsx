import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AutoComplete, Input, App } from "antd"
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons"
import { AxiosError } from "axios"
import { axios } from "../../plugins/AxiosInstance"
import OptionItem from "./OptionItem"
import { SearchOptionSong } from "../../types/Song"

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [options, setOptions] = useState<{ value: string, label: JSX.Element }[]>([])
    const { message } = App.useApp()

    const { isFetching } = useQuery<SearchOptionSong[], AxiosError<any, any>>({
        queryKey: ["search", "youtube", "query", searchQuery],
        enabled: !!searchQuery,
        queryFn: async () => await axios.get(`/search/youtube?query=${searchQuery}`).then(response => response.data),
        onSuccess: data => {
            setOptions(data.map(song => {
                return {
                    value: song.originId,
                    label: <OptionItem song={song} />
                }
            }))
        },
        onError: error => {
            const errorMessage = error.response?.data?.errorMessage
            message.error(errorMessage ?? "Unable to search any songs.")
        },
        cacheTime: 1000 * 60 * 15,
        staleTime: 1000 * 60 * 15
    })

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchQuery(inputValue)
        }, 500)

        return () => clearTimeout(timeout)
    }, [inputValue])

    const onChange = (value: string) => {
        setInputValue(value)
    }

    const onSelect = () => {
        setInputValue("")
    }

    return (
        <AutoComplete
            options={options}
            value={inputValue}
            onSelect={onSelect}
            onChange={onChange}
        >
            <Input
                placeholder="Search"
                prefix={isFetching ? <LoadingOutlined spin /> : <SearchOutlined />}
                size="large"
                style={{ height: 48 }}
            />
        </AutoComplete>
    )
}

export default SearchBar
