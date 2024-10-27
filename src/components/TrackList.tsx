'use client'

import { OrderOption, SortOption, Track } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { PlayerProvider } from './context/Player'
import SortMenu from './SortMenu'
import TrackInfo from './TrackInfo'

interface Props {
  tracks: any
  isAlbum?: boolean
}

interface SortTracks {
  tracks: any
  isAlbum: boolean
  sort: SortOption
  order: OrderOption
}

function sortString(a: string, b: string) {
  return a.localeCompare(b)
}

const sortTracks = ({ tracks, isAlbum, sort, order }: SortTracks) => {
  if (isAlbum) return tracks

  let trackItems = [...tracks.items].filter((item: { track: Track }) => item.track)
  const newOrder = order === 'asc'

  switch (sort) {
    case 'Custom order':
      trackItems = newOrder ? trackItems.slice() : trackItems.slice().reverse()
      break
    case 'Title':
      trackItems = trackItems.sort(
        (a: { track: { name: string } }, b: { track: { name: string } }) =>
          newOrder ? sortString(a.track.name, b.track.name) : sortString(b.track.name, a.track.name)
      )
      break
    case 'Album':
      trackItems = trackItems.sort((a: { track: Track }, b: { track: Track }) => {
        const albumComparison = newOrder
          ? sortString(a.track.album.name, b.track.album.name)
          : sortString(b.track.album.name, a.track.album.name)
        if (albumComparison === 0) {
          return a.track.track_number - b.track.track_number
        }
        return albumComparison
      })
      break
    case 'Date added':
      const order = newOrder ? 1 : -1
      trackItems = trackItems.sort(
        (a: { added_at: string | number | Date }, b: { added_at: string | number | Date }) =>
          order * (new Date(a.added_at).getTime() - new Date(b.added_at).getTime())
      )
      break
  }

  return {
    ...tracks,
    items: trackItems.map((item: { track: Track }, idx: number) => ({
      ...item,
      track: {
        ...item.track,
        order: idx + 1,
      },
    })),
  }
}

const TrackList = ({ tracks, isAlbum = false }: Props) => {
  const searchParams = useSearchParams()

  const sort = (searchParams.get('sort') || 'Custom order') as SortOption
  const order = (searchParams.get('order') || 'asc') as OrderOption

  const sortedTracks = sortTracks({
    tracks,
    isAlbum,
    sort,
    order,
  })

  return (
    <PlayerProvider>
      <div className="bg-white/5 border border-white/10 w-full backdrop-blur-md p-5 rounded-xl flex flex-col gap-5 text-text">
        <div className="flex justify-between items-center mb-1">
          <p className="text-lg text-white/50">{tracks.items.length || tracks.total} tracks</p>

          {!isAlbum && <SortMenu sort={sort} order={order} />}
        </div>
        <ol className="flex flex-col gap-3 w-full">
          {!isAlbum &&
            sortedTracks.items.map((item: any, i: number) => (
              <li key={i}>
                <TrackInfo track={item.track} />
              </li>
            ))}

          {isAlbum &&
            sortedTracks.items.map((item: any, i: number) => (
              <li key={i}>
                <TrackInfo track={item} isAlbum />
              </li>
            ))}
        </ol>
      </div>
    </PlayerProvider>
  )
}

export default TrackList
