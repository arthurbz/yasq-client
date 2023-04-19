import { ResourceOrigin } from "./ResourceOrigin"

interface SearchItemOption {
    id: string
    source: ResourceOrigin
    artist: string
    name: string
    thumbnail: string
}

export type { SearchItemOption }
