import { ResourceOrigin } from "./ResourceOrigin"

interface SearchItemOption {
    id: string
    source: ResourceOrigin
    author: string
    title: string
    thumbnail: string
}

export type { SearchItemOption }
