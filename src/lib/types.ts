export interface Track {
  album: {
    images: [
      {
        url: string
        height: number
        width: number
      }
    ]
    name: string
    type: string
    uri: string
    external_urls: {
      spotify: string
    }
    artists: [
      {
        external_urls: {
          spotify: string
        }
        href: string
        id: string
        name: string
        type: string
        uri: string
      }
    ]
  }
  artists: [
    {
      external_urls: {
        spotify: string
      }
      href: string
      id: string
      name: string
      type: string
      uri: string
    }
  ]
  href: string
  id: string
  name: string
  popularity: number
  preview_url: string
  type: string
  uri: string
  track_number: number
  duration_ms: number
  disc_number: number
  order: number
  explicit: boolean
  external_urls: {
    spotify: string
  }
}

export interface Playlist {
  name: string
  tracks: {
    items: { name: string; track: Track }[]
    total: number
    next: string
  }
  speed: 'slow' | 'fast'
  type: string
  external_urls: {
    spotify: string
  }
  images: [
    {
      url: string
      height: number
      width: number
    }
  ]
  description: string
  label: string
  owner: {
    display_name: string
  }
  followers: {
    total: number
  }
  popularity: number
  artists: [
    {
      external_urls: {
        spotify: string
      }
      href: string
      id: string
      name: string
      type: string
      uri: string
    }
  ]
}

export const SORT_OPTIONS = ['Custom order', 'Title', 'Album', 'Date added'] as const
export type SortOption = (typeof SORT_OPTIONS)[number]
export type OrderOption = 'asc' | 'desc'
