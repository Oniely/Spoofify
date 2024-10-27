'use server'

import axios from 'axios'
import { OrderOption, SortOption } from './types'

export const getToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.CLIENT_ID!,
        password: process.env.CLIENT_SECRET!,
      },
    }
  )

  return response.data.access_token
}

export const getRequest = async (url: string) => {
  const token = await getToken()
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.data
}

function sortString(a: string, b: string) {
  return a.localeCompare(b)
}

export async function getPlaylist(
  id: string,
  sort: SortOption | undefined,
  order: OrderOption | undefined | null
) {
  try {
    let playlist = await getRequest(`https://api.spotify.com/v1/playlists/${id}`)

    let { next } = playlist.tracks
    while (next) {
      const nextTracks = await getRequest(next)
      playlist.tracks.items.push(...nextTracks.items)

      next = nextTracks.next
    }

    if (sort) {
      let sortedItems = playlist.tracks.items
      const newOrder = order === 'asc' ? true : false

      if (sort === 'Custom order') {
        sortedItems = newOrder
          ? playlist.tracks.items.slice()
          : playlist.tracks.items.slice().reverse()
      } else if (sort === 'Title') {
        // we have to filter songs with track value in it,
        // because spotify api have some weird behavior some songs are duplicated,
        // and the track is empty so we do this
        sortedItems = playlist.tracks.items
          .slice()
          .filter((item: { track: any }) => item.track)
          .sort((a: { track: { name: string } }, b: { track: { name: string } }) =>
            newOrder
              ? sortString(a.track.name, b.track.name)
              : sortString(b.track.name, a.track.name)
          )
      } else if (sort === 'Album') {
        sortedItems = playlist.tracks.items
          .slice()
          .filter((item: { track: any }) => item.track)
          .sort(
            (
              a: { track: { album: { name: string }; track_number: number } },
              b: { track: { album: { name: string }; track_number: number } }
            ) => {
              const albumComparison = newOrder
                ? sortString(a.track.album.name, b.track.album.name)
                : sortString(b.track.album.name, a.track.album.name)

              if (albumComparison === 0) {
                return a.track.track_number - b.track.track_number
              }

              return albumComparison
            }
          )
      } else if (sort === 'Date added') {
        const sortOrder = newOrder ? 1 : -1

        sortedItems = playlist.tracks.items
          .slice()
          .sort(
            (a: { added_at: string | number | Date }, b: { added_at: string | number | Date }) =>
              sortOrder * (new Date(a.added_at).getTime() - new Date(b.added_at).getTime())
          )
      }

      playlist.tracks.items = sortedItems
    }

    // add track #, depending on the sorting preference of user
    // filter songs with track value again to avoid duplication - see getPlaylist()
    playlist.tracks.items = playlist.tracks.items
      .filter((item: { track: any }) => item.track)
      .map((item: { track: any }, idx: number) => ({
        ...item,
        track: {
          ...item.track,
          order: idx + 1,
        },
      }))

    return playlist
  } catch (error) {
    console.error(`Error fetching playlist: ${error}`)
  }
}

export async function getTrack(id: string) {
  try {
    const track = await getRequest(`https://api.spotify.com/v1/tracks/${id}`)
    return track
  } catch (error) {
    console.error('Error fetching track: ', error)
  }
}

export async function getAlbum(id: string) {
  try {
    let album = await getRequest(`https://api.spotify.com/v1/albums/${id}`)

    const albumImage = album.images.length > 0 ? album.images[0].url : null

    let { next } = album.tracks
    while (next) {
      const nextTracks = await getRequest(next)
      album.tracks.items.push(...nextTracks.items)

      next = nextTracks.next
    }

    // add metadata
    album.tracks.items = album.tracks.items.map((track: any) => ({
      ...track,
      images: [
        {
          url: albumImage,
        },
      ],
      album: {
        name: album.name,
        images: [
          {
            url: albumImage,
          },
        ],
      },
    }))

    return album
  } catch (error) {
    console.error('Error fetching album: ', error)
  }
}
