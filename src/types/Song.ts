import { ResourceOrigin } from "./ResourceOrigin"

interface Song {
    id: string
    originId: string
    source: ResourceOrigin
    artist: string
    name: string
    thumbnail: string
}

interface SearchOptionSong {
    originId: string
    source: ResourceOrigin
    artist: string
    name: string
    thumbnail: string
}

export type { SearchOptionSong, Song }
