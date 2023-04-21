import { ResourceOrigin } from "./ResourceOrigin"

interface Song {
    originId: string
    source: ResourceOrigin
    artist: string
    name: string
    thumbnail: string
}

export type { Song }
