import { useEffect, useState } from "react"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { AutoComplete, Input, App } from "antd"
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons"
import { AxiosError } from "axios"
import { axios } from "../../plugins/AxiosInstance"
import OptionItem from "./OptionItem"
import { SearchOptionSong } from "../../types/Song"
import { Song } from "../../types/Song"
import { ErrorResponseData } from "../../types/ErrorResponseData"

interface SearchBarItemOption {
    value: string
    song: SearchOptionSong
    label: JSX.Element
}

interface SearchBarProps {
    roomId?: string
}

function SearchBar({ roomId }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [options, setOptions] = useState<SearchBarItemOption[]>([])
    const { message } = App.useApp()
    const queryClient = useQueryClient()

    const { isFetching } = useQuery<SearchOptionSong[], AxiosError<ErrorResponseData, any>>({
        queryKey: ["search", "youtube", "query", searchQuery],
        enabled: !!searchQuery,
        queryFn: async () => await axios.get(`/search/youtube?query=${searchQuery}`).then(response => response.data),
        onSuccess: data => {
            setOptions(data.map(song => {
                return {
                    value: song.originId,
                    song: song,
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

    const { mutate } = useMutation<{ id: string }, AxiosError<ErrorResponseData, any>, SearchOptionSong>({
        mutationKey: ["song", "add"],
        mutationFn: async (song: SearchOptionSong) => {
            const body = {
                info: song.originId,
                roomId: roomId
            }

            return await axios.post("/song/add", body).then(response => response.data)
        },
        onSuccess: async (data, variables) => {
            queryClient.setQueryData(
                ["song", "find", "room", roomId],
                (oldData: Song[] | undefined) => {
                    const newSong: Song = {
                        id: data.id,
                        ...variables
                    }

                    return oldData ? [...oldData, newSong] : [newSong]
                }
            )
            await queryClient.invalidateQueries(["song", "find", "room", roomId])
        },
        onError: error => {
            const errorMessage = error.response?.data?.errorMessage
            message.error(errorMessage ?? "Unable to add this song to the queue.")
        }
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

    const onSelect = (value: string, option: SearchBarItemOption) => {
        mutate(option.song)
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
